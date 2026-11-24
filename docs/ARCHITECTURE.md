# Arsitektur awal dan batas M0

Status: rancangan untuk review owner; belum merupakan penerimaan M0 atau izin implementasi aplikasi.
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

## Rancangan aplikasi setelah gate

| Lapisan | Target dan tanggung jawab | Acuan PRD |
|---|---|---|
| Runtime/backend | PHP 8.6, Laravel 13; kebijakan, validasi, publikasi, dan koordinasi layanan | §3, §4, §6.3 |
| Public web | Blade, Tailwind CSS, Alpine.js, Vite; konten terbit dan navigasi tetap | §3, §5, FR-001–016 |
| CMS | Filament 5; resource, dashboard, media, pengaturan, role, audit | CMS-001–014 |
| Database | MySQL 8.x; kandidat minor 8.4 LTS, belum dikunci; skema/index ditinjau sebelum migrasi | §3, §7 |
| Storage | Pemisahan objek privat dan publik; download hanya untuk konten yang disetujui | CMS-010, §6.3 |
| Kontak | Simpan inquiry dahulu; kegagalan email tidak menghapus rekaman; rate limiting | FR-014, CMS-009 |
| Search/SEO | Filter publikasi di server; metadata dan sitemap mengikuti visibilitas | FR-015–016, §8 |
| Operasi | Log, backup, restore/rollback, staging, dan gate manusia | §8, §11 |

Laravel policies/permissions wajib memeriksa akses di server, bukan sekadar menyembunyikan tombol. Semua jalur publik, pencarian, sitemap, dan unduhan harus menghormati status publikasi dan privasi. Pilihan antrean, email, search engine, storage provider, paket role/audit, dan scheduler belum diputuskan. Tidak ada kebutuhan yang mengharuskan layanan pencarian berbayar dalam M0.

## Keputusan produk yang tetap

- Tentang Kami; Layanan dengan tujuh submenu sesuai PRD §5; Publikasi dengan tepat Berita, Publikasi dan Kajian, Project IT; Kontak; Search. Logo menuju homepage.
- Publikasi dan Kajian memiliki satu listing/submenu publik. Satu model bertipe atau dua model dengan presentasi gabungan masih opsi arsitektur, bukan dua menu.
- Project IT tetap di bawah Publikasi. Jangan memindahkan kategori profil dari Layanan.
- Target PHP 8.6 tidak diganti oleh runtime lokal 8.5. Penilaian ada di [PHP-COMPATIBILITY](PHP-COMPATIBILITY.md).

## Data dan keamanan yang perlu dirancang

Entitas awal mencakup user/role/permission, company profile/missions, executives, experts, organization structures, goals, values, achievements, news/categories, publications/studies, IT projects, media, navigation, contact messages, settings, dan activity logs (PRD §7). Belum ada skema fisik yang disetujui.

Sebelum M1–M4, Planner harus menetapkan ownership dan matriks izin, aturan draft/publish, unique slug, publikasi terjadwal bila masuk scope, referensi media, retensi inquiry/audit, format/ukuran upload, dan soft delete bila beralasan. Buat acceptance criteria untuk akses terlarang dan draft/private leakage sesuai PRD §8.

## Quality gates

M0 memeriksa kelengkapan berkas, parsing YAML, bentuk kontrak Issue/PR, tautan dokumentasi lokal, dan pembatasan workflow. Validator bukan pemindai keamanan menyeluruh atau validator semua fitur GitHub Actions.

M1 menambahkan pengujian aplikasi nyata setelah runtime diterima. M2–M4 menambah tes CRUD, kebijakan akses, publikasi, pencarian, kontak, dan SEO. M5 mengukur WCAG 2.2 AA untuk alur utama dan Lighthouse 85+ dengan skenario yang dapat diulang. Detail browser, perangkat, data uji, dan profil jaringan masih harus disetujui (PRD §8).

## Keputusan terbuka

| Keputusan | Penanggung jawab | Batas sebelum |
|---|---|---|
| Runtime/dependensi/extension/host PHP 8.6 dan Pest atau PHPUnit | Planner menyiapkan bukti, owner menerima | Scaffolding M1 |
| Plan, kontrol merge, identitas dan biaya agent; repository resmi sudah dipilih owner pada Fase 4.5 | Owner + Planner | Aktivasi alur GitHub; bukti di [runbook](AGENT-WORKFLOW.md) |
| Model publications/studies dan editorial governance | Planner + owner | M3 |
| Batas editor navigasi vs struktur tetap | Owner | CMS-014 |
| Cakupan static search, bahasa, dan dokumen terindeks | Owner + Planner | M4 |
| RPO/RTO, retensi, mail/storage, hosting staging/production | Owner + Planner | M6; kelayakan PHP host sebelum M1 |
| Status DONE untuk perubahan dokumentasi tanpa deployment | Owner | Penyelesaian item M0 pada board |

Catat keputusan sebagai konteks, pilihan, bukti, dampak, referensi PRD, identitas pemberi persetujuan, dan tanggal. Instruksi ini tidak mengubah [PRD](PRD.md). Lihat [ROADMAP](ROADMAP.md) untuk dependensi dan batas fase.
