# Vendura Development Guide

## 🎯 Project Core

- **App:** Vendura
- **Type:** Vendor Contract & Compliance Management System
- **Scope:** Backend, Database, API, Approval Workflow Engine, Queue, Redis Cache, Inertia Pages, React Components, Dashboard.
- **Constraint:** NO new features, NO business flow changes, NO architecture changes without explicit approval.

---

## ⚠️ Hard Rules

- **Approval Workflow Order:** Contract approval MUST always follow the sequence `MANAGER → FINANCE → DIREKTUR`. Never skip a stage, never allow parallel approval.
- **Immutable Approval History:** Once an `approval_histories` record is created, it MUST NOT be updated or deleted. Corrections require a new record, never an edit.
- **Document Versioning:** Uploading a revised contract document MUST create a new row in `contract_versions`. Never overwrite an existing `file_path`.
- **Rejection Behavior:** If a contract is rejected at any stage, its status MUST revert to `DRAFT` with the rejection `note` preserved. It MUST NOT be deleted.
- **Contract Activation:** A contract can only reach status `AKTIF` after all three stages (`MANAGER`, `FINANCE`, `DIREKTUR`) are approved. No shortcuts.
- **Role Scope:** Users may only act on approval stages that match their `role`. A `MANAGER` account must never be able to perform a `FINANCE` or `DIREKTUR` decision.
- **Expired Contracts:** Contracts past `end_date` MUST be marked `EXPIRED` by the scheduled job, not manually.
- **Reminder Job Idempotency:** The daily expiry-check job MUST NOT send duplicate reminders for the same contract on the same threshold (H-30/H-7/H-1).
- **Compliance Requirement Scope:** `compliance_requirements` are per-vendor, not per-contract. Never conflate the two.
- **Authentication:** Use existing Laravel Sanctum implementation. Never install Laravel Breeze or Jetstream on top of it.

---

## 🏗️ Architecture Rules

### Request Traffic Separation

#### Path A — Internal Dashboard Traffic

Purpose:

- Authentication
- Contract Management (CRUD)
- Approval Workflow Actions
- Compliance Management
- Reporting Dashboard

Characteristics:

- Low-to-moderate traffic, internal users only
- PostgreSQL as source of truth
- Redis used for caching dashboard aggregates

#### Path B — Background Processing

Purpose:

- Daily expiry-check job (`contracts` scan)
- Reminder notification dispatch (H-30/H-7/H-1)
- Document version cleanup (if applicable)

Characteristics:

- Runs via Laravel Scheduler + Queue
- Must never run synchronously inside a web request
- Failures must be logged and retried, never silently dropped

---

## 🗄️ Database Rules

### Users

Use existing Laravel `users` table, extended with a `role` column.

```text
id
name
email
password
role      -- ADMIN, MANAGER, FINANCE, DIREKTUR
```

### Vendors

Required fields:

```text
id
name
contact_person
phone
email
created_at
updated_at
```

### Contracts

Required fields:

```text
id
vendor_id
created_by
title
value
start_date
end_date
status      -- DRAFT, MENUNGGU_MANAGER, MENUNGGU_FINANCE, MENUNGGU_DIREKTUR, AKTIF, DITOLAK, EXPIRED
created_at
updated_at
```

Rules:

- `status` transitions must only follow the approval workflow order.
- `end_date` must be strictly after `start_date` (enforce via validation, not DB constraint alone).

### Contract Versions

Required fields:

```text
id
contract_id
file_path
version_number
uploaded_by
created_at
```

Rules:

- append-only table
- `version_number` increments sequentially per `contract_id`
- never overwrite a previous row

### Approval Histories

Required fields:

```text
id
contract_id
approver_id
stage        -- MANAGER, FINANCE, DIREKTUR
decision     -- APPROVED, REJECTED
note
created_at
```

Rules:

- append-only table
- source of truth for audit trail
- one row per decision, never updated

### Compliance Requirements

Required fields:

```text
id
vendor_id
document_name
is_fulfilled
file_path
expiry_date
created_at
updated_at
```

Rules:

- scoped to `vendor_id`, not `contract_id`
- `is_fulfilled` must be derived from presence of `file_path` and validity of `expiry_date`, not set manually without a file

---

## 🚀 Redis Rules

### Dashboard Cache

Key:

```text
dashboard:contracts:summary
dashboard:compliance:{vendor_id}
```

Rules:

- dashboard aggregate queries (active contracts count, expiring soon, compliance rate) must be cached
- cache invalidated on contract status change or compliance update
- never cache approval history or raw contract records — only aggregates

### Rate Limiter

Redis must be used for:

```text
contract creation throttling
approval action throttling (prevent double-submit)
```

### Queue

Redis must be used for:

```text
reminder notification dispatch
document version processing (if file conversion needed)
future background jobs
```

---

## 📊 Reporting Rules

Dashboard MUST read from:

```text
cached aggregates (dashboard:contracts:summary, dashboard:compliance:{vendor_id})
```

Dashboard MUST NOT aggregate directly from:

```text
approval_histories (for counts/summaries)
contract_versions (for counts/summaries)
```

Reminder processing flow:

```text
Scheduler (daily)
→ Queue Job: check contracts nearing end_date
→ Dispatch Notification (email/in-app)
→ Log reminder sent (prevent duplicate)
```

Reminder dispatch must never block the scheduler or any web request.

---

## 🎨 Frontend Rules

Framework:

```text
Inertia.js
React
TypeScript
```

Design Source:

```text
DESIGN.md
```

Requirements:

- Mobile responsive (dashboard primarily used on desktop, but must not break on tablet/mobile)
- Clear visual distinction between contract statuses (color-coded badges)
- Approval action buttons only visible to the role matching the current pending stage
- Reusable components for contract cards, approval timeline, compliance checklist
- Type-safe forms (TypeScript interfaces matching backend Form Request shape)

---

## 🔒 Security Rules

Validation requirements:

- `end_date` must be after `start_date`
- uploaded documents must be restricted to allowed file types (PDF, DOCX, JPG, PNG) and max size
- `decision` field must only accept `APPROVED` or `REJECTED`

Authorization requirements:

- users can only perform approval actions matching their own `role` AND the contract's current pending `stage`
- users can only view/edit contracts they created, unless role is `MANAGER`, `FINANCE`, or `DIREKTUR` (review access)
- unauthorized access must return proper HTTP responses (403), never silent redirects

Never trust frontend validation.

Always validate on backend using Form Request + Policy.

---

## ⚡ Performance Rules

Preferred order:

```text
Redis (dashboard aggregates)
↓
PostgreSQL (source of truth)
```

Avoid:

- N+1 queries when loading contracts with vendor, latest version, and approval history
- unnecessary eager loading of `approval_histories` on list views (only load on detail view)
- synchronous reminder/notification dispatch during scheduler run
- recalculating dashboard aggregates on every page load without cache

Optimize for:

- approval action response time
- dashboard load time
- queue throughput for reminder jobs

---

## ✅ Expected Output

Generate production-oriented code following:

- Laravel best practices
- Thin Controllers
- Action-based business logic (especially for approval workflow transitions)
- Form Request validation
- Policy-based authorization
- Service container dependency injection
- PostgreSQL optimization
- Redis-first dashboard aggregation

Rules:

- Be concise.
- Output code first.
- Avoid tutorials.
- Avoid speculative features.
- Avoid overengineering.
- Do not change architecture without approval.
- Follow documentation before generating code.
- Prefer maintainability over cleverness.