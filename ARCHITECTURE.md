# Vendura — Architecture Guide

## 🎯 Tujuan Dokumen
File ini jadi acuan teknis buat AI Agent (dan kamu) soal *bagaimana* kode disusun — struktur folder, pattern, konvensi penamaan. `PRD.md` jelasin "apa", `AGENTS.md` jelasin "aturan main", file ini jelasin "cara eksekusinya".

---

## 🏗️ Struktur Folder (Laravel + Inertia)

```text
app/
├── Actions/                  # Business logic per use-case (bukan di Controller)
│   ├── Contracts/
│   │   ├── CreateContractAction.php
│   │   ├── ApproveContractAction.php
│   │   ├── RejectContractAction.php
│   │   └── UploadContractVersionAction.php
│   ├── Compliance/
│   │   └── UpdateComplianceStatusAction.php
│   └── Reminders/
│       └── CheckExpiringContractsAction.php
├── Http/
│   ├── Controllers/
│   │   ├── ContractController.php       # thin, cuma panggil Action
│   │   ├── ApprovalController.php
│   │   ├── ComplianceController.php
│   │   └── DashboardController.php
│   ├── Requests/                        # Form Request validation
│   │   ├── StoreContractRequest.php
│   │   ├── ApproveContractRequest.php
│   │   └── UploadComplianceDocumentRequest.php
│   └── Resources/                       # API/Inertia response shaping
│       ├── ContractResource.php
│       └── VendorResource.php
├── Models/
│   ├── User.php
│   ├── Vendor.php
│   ├── Contract.php
│   ├── ContractVersion.php
│   ├── ApprovalHistory.php
│   └── ComplianceRequirement.php
├── Policies/
│   ├── ContractPolicy.php
│   └── CompliancePolicy.php
├── Jobs/
│   └── SendContractExpiryReminder.php
├── Notifications/
│   └── ContractExpiringNotification.php
└── Enums/
    ├── ContractStatus.php               # DRAFT, MENUNGGU_MANAGER, dst
    ├── ApprovalStage.php                # MANAGER, FINANCE, DIREKTUR
    └── UserRole.php                     # ADMIN, MANAGER, FINANCE, DIREKTUR

resources/js/
├── Pages/
│   ├── Dashboard/Index.tsx
│   ├── Contracts/Index.tsx
│   ├── Contracts/Show.tsx
│   ├── Contracts/Create.tsx
│   └── Compliance/Index.tsx
├── Components/
│   ├── ContractStatusBadge.tsx
│   ├── ApprovalTimeline.tsx
│   ├── ComplianceChecklist.tsx
│   └── ContractCard.tsx
├── Layouts/
│   └── AuthenticatedLayout.tsx
└── types/
    └── index.d.ts                       # TypeScript interface, mirror Form Request
```

---

## 📐 Pattern yang Dipakai

**Controller → Action → Model** (bukan logic numpuk di Controller, bukan juga Repository pattern penuh — overkill buat scope project ini).

```php
// Controller: thin, cuma orchestration
class ApprovalController extends Controller
{
    public function approve(ApproveContractRequest $request, Contract $contract, ApproveContractAction $action)
    {
        $this->authorize('approve', $contract);
        $action->execute($contract, $request->user(), $request->validated());
        return redirect()->back();
    }
}
```

```php
// Action: business logic murni, testable, reusable
class ApproveContractAction
{
    public function execute(Contract $contract, User $approver, array $data): void
    {
        // validasi stage sesuai role
        // simpan approval_histories
        // update status contract sesuai urutan workflow
    }
}
```

**Kenapa pattern ini:** Action class gampang di-unit-test terpisah dari HTTP layer, dan ini yang bakal jadi bagian paling kamu pelajari manual (sesuai checklist post-vibe-coding — approval logic WAJIB kamu paham betul, bukan cuma di-generate).

---

## 🔤 Konvensi Penamaan

| Elemen | Konvensi | Contoh |
|---|---|---|
| Model | PascalCase, singular | `Contract`, `ComplianceRequirement` |
| Tabel DB | snake_case, plural | `contracts`, `compliance_requirements` |
| Kolom DB | snake_case | `start_date`, `is_fulfilled` |
| Action class | PascalCase + `Action` suffix | `ApproveContractAction` |
| Form Request | PascalCase + `Request` suffix | `StoreContractRequest` |
| Route name | kebab-case, resource-based | `contracts.approve`, `compliance.index` |
| React component | PascalCase | `ApprovalTimeline.tsx` |
| Enum | PascalCase, value UPPER_SNAKE | `ContractStatus::MENUNGGU_MANAGER` |

---

## 🔄 State Machine — Approval Workflow

Ini bagian paling kritis, ditulis eksplisit biar AI Agent gak improvisasi:

```text
DRAFT
  → (submit) → MENUNGGU_MANAGER
MENUNGGU_MANAGER
  → (approve) → MENUNGGU_FINANCE
  → (reject)  → DRAFT
MENUNGGU_FINANCE
  → (approve) → MENUNGGU_DIREKTUR
  → (reject)  → DRAFT
MENUNGGU_DIREKTUR
  → (approve) → AKTIF
  → (reject)  → DRAFT
AKTIF
  → (scheduled job, end_date lewat) → EXPIRED
```

Setiap transisi WAJIB menghasilkan 1 baris baru di `approval_histories` (kecuali transisi `AKTIF → EXPIRED` yang dilakukan sistem, bukan user approval).

---

## 🌐 API/Route Convention

Pakai Inertia response (bukan JSON API murni), tapi tetap resource-based routing:

```text
GET    /contracts                  → daftar kontrak (filtered by role)
GET    /contracts/create           → form buat kontrak baru
POST   /contracts                  → simpan kontrak (status: DRAFT)
GET    /contracts/{contract}       → detail kontrak + approval timeline
POST   /contracts/{contract}/submit   → submit ke approval (DRAFT → MENUNGGU_MANAGER)
POST   /contracts/{contract}/approve  → approve sesuai stage user
POST   /contracts/{contract}/reject   → reject, balik ke DRAFT
POST   /contracts/{contract}/versions → upload versi dokumen baru

GET    /compliance                     → daftar vendor + status kelengkapan
POST   /compliance/{vendor}/requirements → tambah/update requirement

GET    /dashboard                  → summary aggregat (dari cache Redis)
```

---

## ⚙️ Environment & Config Penting

```env
DB_CONNECTION=pgsql
DB_PORT=5432

QUEUE_CONNECTION=redis
CACHE_STORE=redis

FILESYSTEM_DISK=local   # ganti ke s3 saat produksi
```

Job scheduler (`app/Console/Kernel.php` atau `routes/console.php` di Laravel 11+):
```php
Schedule::job(new CheckExpiringContractsAction)->daily();
```

---

## 🚫 Batasan Eksplisit (biar AI Agent gak overengineer)

- Jangan bikin Repository pattern terpisah — Action + Eloquent Model udah cukup buat scope ini.
- Jangan bikin microservice/separate API — tetap monolith Laravel + Inertia.
- Jangan bikin real-time websocket notification di awal — cukup notifikasi in-app biasa (cek saat load dashboard) dulu, websocket bisa jadi improvement fase 2.
- Jangan generate ML/statistical anomaly detection apapun — di luar scope project ini sepenuhnya.