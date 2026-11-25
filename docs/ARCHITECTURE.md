# Arsitektur awal dan batas M0

Status: fondasi Laravel awal diizinkan owner melalui PRD §13 v1.7 / Issue #8; arsitektur modul bisnis berikutnya tetap rancangan. Ini belum penerimaan M0 atau izin merge/deploy.
Acuan: [PRD](PRD.md) §§1–8, 9.6, 10–13.

## Arsitektur proses yang disiapkan

```text
Human Owner + PRD
       |
Planner -> Issue READY -> Executor / feature branch -> Pull Request
                                                        |
                                                  CI pemeriksaan M0
                                                        |
                                                     Reviewer
                                              /                     \
                                    CHANGES_REQUESTED             APPROVED
                                           |                         |
                                    PR yang sama              kontrol merge GitHub
                                                                     |
                                                         staging -> owner -> production
```

Bagian setelah review adalah target fase berikutnya, bukan otomasi yang telah terpasang. Saat ini hanya dokumentasi, template, dan validator lokal/konfigurasi CI yang disiapkan. Agent tidak dipanggil oleh workflow. Detail: [runbook](AGENT-WORKFLOW.md).

Batas kepercayaan workflow memisahkan sesi Reviewer dan publisher dari sesi implementasi. Planner dan Worker boleh berbagi chat secara berurutan dengan handoff peran/model tercatat (PRD v1.6). Identitas GitHub boleh sama, tetapi kredensial publisher/admin tidak dibagikan ke lingkungan Executor. Publisher memverifikasi hasil Reviewer dan CI terhadap repository/PR/head/base sebelum menerbitkan status `Agent review`. Native approval dari akun kedua tidak diwajibkan. Target seluruh peran workflow `gpt-6-astra/high`; pada aplikasi Planner/Reviewer tetap `gpt-6-astra/high`, Worker `gpt-6.1-sol/medium`. Simulator offline menguji sebagian kebijakan secara sintetis; integrasi native, isolasi izin dan bukti penerapan aktual masih pending. Acuan: PRD §§9.1, 9.5, 11, 13.

## Rancangan aplikasi setelah gate

Tampilan publik menggunakan Laravel Blade. Issue #8 mengimplementasikan halaman awal melalui route view dan Vite; belum ada logika bisnis sehingga tidak dibuat controller/service/repository kosong. Konfigurasi MySQL dan migration bawaan Laravel disiapkan tanpa menjalankan migrasi pada database existing. Implementasi CMS/fitur produk menyusul dalam Issue tersendiri (PRD §§3, 13 v1.7).

| Lapisan | Target dan tanggung jawab | Acuan PRD |
|---|---|---|
| Runtime/backend | PHP 8.5.12, Laravel 13; kebijakan, validasi, publikasi, dan koordinasi layanan | §3, §4, §6.3 |
| Public web | Blade, Tailwind CSS, Alpine.js, Vite; konten terbit dan navigasi tetap | §3, §5, FR-001–016 |
| CMS | Filament 5; resource, dashboard, media, pengaturan, role, audit | CMS-001–014 |
| Database | MySQL 8.x; kandidat minor 8.4 LTS, belum dikunci; skema/index ditinjau sebelum migrasi | §3, §7 |
| Storage | Pemisahan objek privat dan publik; download hanya untuk konten yang disetujui | CMS-010, §6.3 |
| Kontak | Simpan inquiry dahulu; kegagalan email tidak menghapus rekaman; rate limiting | FR-014, CMS-009 |
| Search/SEO | Filter publikasi di server; metadata dan sitemap mengikuti visibilitas | FR-015–016, §8 |
| Operasi | Log, backup, restore/rollback, staging, dan gate manusia | §8, §11 |

Laravel policies/permissions wajib memeriksa akses di server, bukan sekadar menyembunyikan tombol. Semua jalur publik, pencarian, sitemap, dan unduhan harus menghormati status publikasi dan privasi. Pilihan antrean, email, search engine, storage provider, paket role/audit, dan scheduler belum diputuskan. Tidak ada kebutuhan yang mengharuskan layanan pencarian berbayar dalam M0.

## Clean Architecture dan Clean Code

Aturan ini berlaku untuk perubahan kode sesuai scope Issue, termasuk tooling sekarang dan aplikasi setelah diizinkan. Gunakan struktur Laravel yang tersedia; tidak ada kewajiban membuat semua lapisan atau folder di awal.

| Batas | Tanggung jawab dan pemeriksaan review |
|---|---|
| Input/presentasi | Controller, Filament Resource dan Blade menangani input, memanggil use case dan menyajikan hasil. Tidak menyimpan aturan bisnis yang diduplikasi, query database di Blade, atau orkestrasi email/storage di tampilan. |
| Use case | Action/service yang terfokus mengoordinasikan satu alur bisnis, termasuk batas transaksi bila relevan. Tidak bergantung pada controller, Blade atau Filament Resource. Aturan bisnis murni dapat diuji tanpa HTTP/UI. |
| Data dan layanan luar | Eloquent menangani persistence, relasi dan query/scopes; email/storage/API adalah efek samping yang eksplisit. Pakai adapter/interface sempit jika ada batas eksternal atau kebutuhan substitusi/pengujian yang nyata. Eloquent boleh dipakai langsung oleh use case sederhana; tidak wajib membuat repository untuk setiap tabel. |
| Validasi dan izin | Validasi input pada boundary, gunakan Form Request atau fasilitas Filament yang sesuai dan aturan bersama bila perlu. Otorisasi server melalui policy/permission; invariant bisnis tetap berlaku dari setiap jalur pemanggilan. |
| Kegagalan | Tentukan hasil saat validasi, akses, database atau layanan luar gagal. Jangan menelan error; gunakan transaksi dan retry hanya bila sesuai kebutuhan. Log cukup untuk diagnosis tanpa secret/data sensitif. |

Arah dependensi: input/UI → use case → aturan bisnis; detail I/O disambungkan pada batas yang membutuhkannya. Modul bisnis tidak mengimpor modul presentasi. Dependency injection digunakan bila membantu batas dan pengujian; hindari service locator/global state tersembunyi di logika bisnis. Jangan membuat microservice, event bus, generic repository, DTO atau interface kosong hanya untuk menyebut arsitektur bersih.

Clean Code diperiksa melalui hal konkret: nama memakai istilah domain yang konsisten; fungsi dan kelas mempunyai tujuan yang jelas; alur kontrol mudah dibaca; tidak ada duplikasi aturan, dead code atau god class; dependensi/efek samping terlihat; konstanta dan tipe dipakai saat memperjelas kontrak. Komentar menjelaskan alasan atau batas penting. Ikuti formatter/linter yang tersedia, tanpa batas panjang fungsi yang arbitrer atau refactor di luar Issue.

Planner mencantumkan alur input → use case → data/layanan luar, tanggung jawab komponen, AC dan risiko. Worker menjelaskan penempatan kode dan alasan abstraksi/dependency baru pada PR. Reviewer memeriksa perilaku, arah dependensi dan kualitas dari diff aktual, bukan hanya nama folder. Dokumentasi murni memakai N/A beralasan untuk dampak arsitektur kode.

Tes unit memeriksa aturan bisnis yang terisolasi; tes feature/integrasi memeriksa wiring, otorisasi, persistence dan efek samping yang relevan. Cakup jalur berhasil serta kegagalan penting seperti draft/private leakage dan kegagalan email setelah inquiry tersimpan. Mock layanan luar bila tepat; jangan mengganti semua logika internal dengan mock atau membuat tes yang hanya menyalin implementasi. Pada M0 jalankan hanya tes tooling yang tersedia; contoh aplikasi ini adalah aturan untuk tahap berikutnya.

## Keputusan produk yang tetap

- Tentang Kami; Layanan dengan tujuh submenu sesuai PRD §5; Publikasi dengan tepat Berita, Publikasi dan Kajian, Project IT; Kontak; Search. Logo menuju homepage.
- Publikasi dan Kajian memiliki satu listing/submenu publik. Satu model bertipe atau dua model dengan presentasi gabungan masih opsi arsitektur, bukan dua menu.
- Project IT tetap di bawah Publikasi. Jangan memindahkan kategori profil dari Layanan.
- Target PHP 8.5.12 menggantikan 8.6 atas keputusan owner yang tercatat pada PRD §13. Runtime CLI, web, CI, dan hosting harus diverifikasi terhadap target ini; penilaian ada di [PHP-COMPATIBILITY](PHP-COMPATIBILITY.md).

## Data dan keamanan yang perlu dirancang

Entitas awal mencakup user/role/permission, company profile/missions, executives, experts, organization structures, goals, values, achievements, news/categories, publications/studies, IT projects, media, navigation, contact messages, settings, dan activity logs (PRD §7). Belum ada skema fisik yang disetujui.

Sebelum M1–M4, Planner harus menetapkan ownership dan matriks izin, aturan draft/publish, unique slug, publikasi terjadwal bila masuk scope, referensi media, retensi inquiry/audit, format/ukuran upload, dan soft delete bila beralasan. Buat acceptance criteria untuk akses terlarang dan draft/private leakage sesuai PRD §8.

## Quality gates

M0 memeriksa kelengkapan berkas, parsing YAML, bentuk kontrak Issue/PR, tautan dokumentasi lokal, dan pembatasan workflow. Validator bukan pemindai keamanan menyeluruh atau validator semua fitur GitHub Actions.

M1 menambahkan pengujian aplikasi nyata setelah runtime diterima. M2–M4 menambah tes CRUD, kebijakan akses, publikasi, pencarian, kontak, dan SEO. M5 mengukur WCAG 2.2 AA untuk alur utama dan Lighthouse 85+ dengan skenario yang dapat diulang. Detail browser, perangkat, data uji, dan profil jaringan masih harus disetujui (PRD §8).

## Keputusan terbuka

| Keputusan | Penanggung jawab | Batas sebelum |
|---|---|---|
| Runtime/dependensi/extension/host PHP 8.5.12 dan Pest atau PHPUnit | Planner menyiapkan bukti, owner menerima | Scaffolding M1 |
| Plan, kontrol merge, identitas dan biaya agent; repository resmi sudah dipilih owner pada Fase 4.5 | Owner + Planner | Aktivasi alur GitHub; bukti di [runbook](AGENT-WORKFLOW.md) |
| Model publications/studies dan editorial governance | Planner + owner | M3 |
| Batas editor navigasi vs struktur tetap | Owner | CMS-014 |
| Cakupan static search, bahasa, dan dokumen terindeks | Owner + Planner | M4 |
| RPO/RTO, retensi, mail/storage, hosting staging/production | Owner + Planner | M6; kelayakan PHP host sebelum M1 |
| Status DONE untuk perubahan dokumentasi tanpa deployment | Owner | Penyelesaian item M0 pada board |

Catat keputusan sebagai konteks, pilihan, bukti, dampak, referensi PRD, identitas pemberi persetujuan, dan tanggal. Instruksi ini tidak mengubah [PRD](PRD.md). Lihat [ROADMAP](ROADMAP.md) untuk dependensi dan batas fase.
