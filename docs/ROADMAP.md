# Roadmap dan backlog yang belum diterbitkan

Acuan: [PRD](PRD.md) §§9.6, 10–13. Ini rencana dependensi, bukan janji tanggal atau bukti milestone selesai.

## Milestone

| Milestone | Hasil | Dependensi / gate |
|---|---|---|
| M0 | Dokumen agent, kontrak Issue/PR, CI aman, runbook GitHub, bukti kompatibilitas | Review owner; repository dan kontrol terverifikasi sebelum disebut operasional |
| M1 | Laravel 13 + MySQL 8.x + Filament 5, auth/roles, CI aplikasi | M0 diterima dan runtime PHP 8.6/dependensi/host disetujui (§3) |
| M2 | Company/profile CMS, executive, experts, structure, goals, values, achievements, homepage content | Fondasi dan izin M1; FR-002–010, CMS-002–005 |
| M3 | News, satu bagian Publikasi dan Kajian, Project IT | Arsitektur publikasi dan izin; FR-011–013, CMS-006–008 |
| M4 | Search, contact, SEO | Konten/status M2–M3; FR-014–016, CMS-009/011 |
| M5 | UI modern minimalis, responsive, accessibility, security/regression | Fungsi utama tersedia; §8 dan penerimaan M0 sebelum desain |
| M6 | Staging UAT, backup/rollback, rilis dengan owner | Semua gate kualitas dan production approval; §11 |

M0 tidak membuat aplikasi, migrasi, resource Filament, UI, konten bisnis, search berbayar, atau deployment. Fase percakapan 3–4 menghasilkan paket fondasi; itu tidak otomatis menandakan seluruh milestone M0 diterima. Fase 5 memerlukan persetujuan owner terpisah.

Fase 4.5 menghubungkan folder lokal ke repository resmi yang dipilih owner dan menyiapkan PR M0. Akses admin dan remote telah diverifikasi; publikasi baseline/branch, PR, dan run CI menunggu persetujuan push. API proteksi branch/ruleset mengembalikan HTTP 403 karena keterbatasan plan repository private. M0-B belum selesai sampai baseline/PR tersedia; M0-C belum lulus. Bukti dan rencana aman: [AGENT-WORKFLOW](AGENT-WORKFLOW.md), mengacu PRD §§9.5, 11, 13.

## Backlog rancangan lokal

ID berikut adalah ID rencana, bukan nomor atau Issue GitHub. Tidak ada Issue yang diterbitkan. Konversi melalui [ISSUE-GUIDELINES](ISSUE-GUIDELINES.md) hanya setelah owner mengizinkan fase berikutnya.

| ID / scope kecil | Dependensi | Kriteria selesai dan bukti | Acuan PRD |
|---|---|---|---|
| M0-A: review dan penerimaan paket Fase 3–4 | Berkas dan hasil validasi lokal | Owner mencatat keputusan atas diff dan batas fase; temuan ditutup | §9.6, §11 |
| M0-B: repository, remote, hak akses, bootstrap main | Keputusan owner atas nama/visibility/plan; M0-A | URL/permission terverifikasi; baseline main sesuai; PR feature dapat dibuat tanpa force-push | §9.5, §13 |
| M0-C: jalankan CI dan enforce checks/review | M0-B, izin admin | Run pada commit aktual lulus; PR tanpa check/approval tertahan; bukti konfigurasi tersedia | §9.5, §11 |
| M0-D: labels, Projects, transisi dan ownership | M0-B, izin Projects | Label dan seluruh status tersedia; simulasi transisi tercatat; aturan DONE dokumentasi diputuskan | §9.2–9.5 |
| M0-E: validasi runtime dan dependensi PHP 8.6 | Paket/extension/test runner kandidat; lingkungan uji | Install tanpa bypass, platform check dan tes nyata berhasil; host mendukung atau blocker dicatat | §3, §9.6 |
| M0-F: integrasi Planner/Executor/Reviewer | M0-C/D, keputusan model/biaya/izin | Satu tugas percobaan menjalani Issue → PR → CI → review → rework PR yang sama; SHA/log/biaya tercatat | §2, §9.1–9.5 |
| M0-G: rancangan release controls | Host/plan, M0-C | Pemisahan kewenangan, staging, approval, backup/rollback direview; template tetap disabled | §8, §9.6, §11 |

M0-E dapat diteliti sambil dokumentasi berjalan. Bukti end-to-end tidak boleh diklaim hanya dari formulir, akun CLI, atau YAML. Jika gate runtime belum lulus, M1 tetap tertahan walaupun dokumen M0 selesai.

## Penerimaan dan blocker

Owner perlu menerima arsitektur, pembagian izin, nama repository/plan, mekanisme agent dan batas biaya, hasil kompatibilitas, serta aturan closure dokumentasi. Detail status akses dan kontrol di [AGENT-WORKFLOW](AGENT-WORKFLOW.md); bukti runtime di [PHP-COMPATIBILITY](PHP-COMPATIBILITY.md).

Belum ada tanggal, anggaran, hosting, konten perusahaan, atau jadwal rilis yang disetujui. Planner harus memecah backlog menjadi kontrak Issue lengkap sebelum READY; tabel ini tidak menggantikan kontrak tersebut.
