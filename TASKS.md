# Vendura — Task Breakdown

## 🎯 Cara Pakai File Ini
Eksekusi **berurutan dari atas ke bawah**, jangan loncat. Tiap phase sekarang sudah termasuk task **Backend** dan **Frontend** sekaligus — kerjakan backend-nya dulu, baru frontend di phase yang sama, biar tiap fitur langsung bisa dites end-to-end lewat UI sebelum lanjut ke phase berikutnya. Tiap task selesai, jalankan `CHECKLIST.md` sebelum centang dan lanjut ke task berikutnya. Kalau prompt ke AI Agent, referensikan task spesifik, jangan minta "buatkan semua fitur Vendura" sekaligus — itu yang bikin hasil vibe coding berantakan dan susah di-review.

---

## Phase 0 — Setup Project

- [ ] Init project Laravel baru + install Inertia (React + TypeScript preset)
- [ ] Setup `docker-compose.yml`: Laravel app, PostgreSQL, Redis
- [ ] Konfigurasi `.env` (DB_CONNECTION=pgsql, QUEUE_CONNECTION=redis, CACHE_STORE=redis)
- [ ] Install & konfigurasi Laravel Sanctum
- [ ] Setup Tailwind CSS + struktur folder sesuai `ARCHITECTURE.md`
- [ ] Setup `AuthenticatedLayout.tsx` (sidebar/navbar dasar, placeholder menu: Contracts, Compliance, Dashboard)
- [ ] Setup TypeScript base types di `types/index.d.ts` (User, Vendor — akan bertambah tiap phase)
- [ ] Pastikan `docker-compose up` jalan tanpa error, migrate default berhasil, halaman Inertia default kebuka di browser

## Phase 1 — Database & Model Foundation

- [x] Migration: `vendors` (name, contact_person, phone, email)
- [x] Migration: tambah kolom `role` ke tabel `users` (enum: ADMIN, MANAGER, FINANCE, DIREKTUR)
- [x] Migration: `contracts` (vendor_id, created_by, title, value, start_date, end_date, status)
- [x] Migration: `contract_versions` (contract_id, file_path, version_number, uploaded_by)
- [x] Migration: `approval_histories` (contract_id, approver_id, stage, decision, note)
- [x] Migration: `compliance_requirements` (vendor_id, document_name, is_fulfilled, file_path, expiry_date)
- [x] Model + relationship Eloquent semua tabel di atas (cek `ARCHITECTURE.md` buat penamaan)
- [x] Enum class: `ContractStatus`, `ApprovalStage`, `UserRole`
- [x] Seeder: dummy data vendor, user per role, beberapa contract contoh
- [x] **Checkpoint:** jalankan `php artisan migrate:fresh --seed`, cek data masuk benar via Tinker

## Phase 2 — Auth & Role Middleware

- [x] Setup login/register pakai Sanctum (session-based, bukan token, karena SPA-like via Inertia)
- [x] Middleware/Gate: cek role user untuk akses tiap halaman dashboard
- [x] Policy: `ContractPolicy` (siapa bisa create, view, approve sesuai role & stage)
- [x] **Frontend:** halaman `Login.tsx` (form email/password, type-safe pakai Inertia `useForm`)
- [x] **Frontend:** conditional rendering menu sidebar sesuai `role` user yang login (misal: menu approval cuma muncul buat Manager/Finance/Direktur)
- [x] **Checkpoint:** login sebagai 4 role berbeda, pastikan akses halaman & tampilan menu sesuai role masing-masing

## Phase 3 — Contract CRUD (Backend + Frontend)

- [x] `StoreContractRequest` — validasi title, value, start_date < end_date, vendor_id exists
- [x] `ContractController@store` — simpan kontrak status default `DRAFT`
- [x] `ContractController@index` — list kontrak (filter by role: creator lihat punya sendiri, approver lihat yang perlu direview)
- [x] `ContractController@show` — detail kontrak + relasi vendor, versions, approval history
- [x] Upload dokumen kontrak awal → otomatis masuk `contract_versions` versi 1
- [x] Update `types/index.d.ts` — tambah interface `Contract`, `Vendor` (mirror Form Request)
- [x] **Frontend:** `Contracts/Index.tsx` — list kontrak pakai `ContractCard.tsx`, tampilkan `ContractStatusBadge.tsx`
- [x] **Frontend:** `Contracts/Create.tsx` — form buat kontrak baru (Inertia `useForm`, validasi error dari backend ditampilkan)
- [x] **Frontend:** `Contracts/Show.tsx` — detail kontrak, termasuk info vendor & dokumen versi terbaru
- [x] **Checkpoint:** manual test create-view kontrak lewat UI (bukan cuma Postman/Tinker), cek data tersimpan benar, dokumen ke-upload ke storage

## Phase 4 — Approval Workflow Engine 

- [x] `ApproveContractAction` — logic transisi status sesuai state machine di `ARCHITECTURE.md`
- [x] `RejectContractAction` — logic reject balik ke `DRAFT` + simpan note
- [x] `ApprovalController@approve` & `@reject` — thin controller, panggil Action
- [x] Validasi: user cuma bisa approve/reject sesuai `stage` yang cocok dengan `role`-nya
- [x] Setiap approve/reject WAJIB insert baris baru ke `approval_histories`, cek tidak ada update/overwrite
- [x] **Frontend:** `ApprovalTimeline.tsx` — tampilkan histori approval (siapa, kapan, keputusan, catatan) di halaman `Contracts/Show.tsx`
- [x] **Frontend:** tombol Approve/Reject di `Contracts/Show.tsx` — hanya muncul kalau `role` user match dengan `stage` kontrak saat ini (logic ini juga wajib kamu pahami sendiri, bukan cuma backend-nya)
- [x] **Frontend:** modal/form alasan reject (wajib isi note sebelum submit reject)
- [x] **Checkpoint:** (manual test) login gonta-ganti role, test flow DRAFT → MANAGER → FINANCE → DIREKTUR → AKTIF

## Phase 5 — Document Versioning

- [ ] `UploadContractVersionAction` — upload dokumen baru, auto-increment `version_number`
- [ ] Endpoint untuk lihat daftar versi dokumen per kontrak
- [ ] **Frontend:** komponen daftar versi dokumen di `Contracts/Show.tsx` (nama file, versi ke berapa, tanggal upload, link download)
- [ ] **Frontend:** form upload versi baru (validasi tipe file di frontend sebelum submit, tapi tetap validasi ulang di backend)
- [ ] **Checkpoint:** upload 2-3 versi dokumen di 1 kontrak lewat UI, pastikan versi lama tidak ketimpa/hilang dan tetap bisa didownload

## Phase 6 — Compliance Management (Backend + Frontend)

- [ ] `ComplianceController` — CRUD requirement per vendor
- [ ] Upload dokumen compliance, auto-update `is_fulfilled` berdasarkan ada/tidaknya file
- [ ] **Frontend:** `Compliance/Index.tsx` — daftar vendor + ringkasan status kelengkapan
- [ ] **Frontend:** `ComplianceChecklist.tsx` — checklist per vendor (nama dokumen, status, tanggal expired, tombol upload)
- [ ] **Checkpoint:** tandai requirement lengkap/belum lewat UI, cek status berubah sesuai upload dokumen

## Phase 7 — Reminder & Scheduled Job

- [ ] `CheckExpiringContractsAction` — scan kontrak dengan `end_date` mendekati (H-30/H-7/H-1)
- [ ] `SendContractExpiryReminder` Job — dispatch via Queue, kirim notifikasi
- [ ] Schedule job harian di scheduler
- [ ] Logic cegah reminder duplikat (cek sudah dikirim di threshold yang sama)
- [ ] Job: auto-update status `AKTIF → EXPIRED` saat `end_date` lewat
- [ ] **Checkpoint:** jalankan job manual (`php artisan schedule:run` / test langsung), cek notifikasi terkirim sekali per threshold

## Phase 8 — Dashboard & Caching (Backend + Frontend)

- [ ] Query aggregat: total kontrak aktif, kontrak mendekati expired, compliance rate per vendor
- [ ] Cache hasil aggregat ke Redis (key sesuai `AGENTS.md`: `dashboard:contracts:summary`, dst)
- [ ] Invalidasi cache saat status kontrak/compliance berubah
- [ ] **Frontend:** `Dashboard/Index.tsx` — tampilkan summary cards (total aktif, mendekati expired, compliance rate)
- [ ] **Frontend:** grafik sederhana (misal pakai Recharts) — tren kontrak aktif per bulan, atau compliance rate per vendor
- [ ] **Checkpoint:** cek dashboard nge-load dari cache (bukan query ulang tiap refresh) lewat UI, cache ke-invalidate saat ada perubahan data

## Phase 9 — Testing

- [ ] Unit test: `ApproveContractAction`, `RejectContractAction` (paling prioritas)
- [ ] Feature test: alur submit → approve penuh → status jadi AKTIF
- [ ] Feature test: role yang salah coba approve → harus ditolak (403)
- [ ] Feature test: reminder job tidak kirim duplikat

## Phase 10 — Deployment

- [ ] Finalisasi `docker-compose.yml` untuk production (Nginx, Supervisor buat queue worker)
- [ ] Setup environment production (`.env.production`)
- [ ] Deploy ke VPS, test end-to-end di environment production
- [ ] Setup SSL (Certbot)

---

## ⚠️ Catatan Prioritas Belajar Manual
Task di **Phase 4 (Approval Workflow)** adalah bagian yang paling wajib kamu pahami baris per baris, bukan cuma di-generate lalu diterima. Kalau ada bagian yang setelah dibaca ulang kamu masih bingung logic-nya, itu sinyal buat stop dan minta AI jelasin dulu — bukan lanjut ke task berikutnya.