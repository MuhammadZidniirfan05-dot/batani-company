# Roadmap dan backlog yang belum diterbitkan

**Mulai M1 terbatas, PRD v1.7:** owner mengizinkan fondasi Laravel pada Issue #8 sekarang dengan agent mahal, tanpa mengklaim penerimaan formal M0 selesai. Scope Laravel/Blade awal, konfigurasi MySQL, dependency/tes/CI; CMS, MySQL live dan hosting menyusul. Snapshot dependensi lama di bawah tetap riwayat; gate merge/release tetap wajib.

Acuan: [PRD](PRD.md) §§9.6, 10–13. Ini rencana dependensi, bukan janji tanggal atau bukti milestone selesai.

**Aturan terbaru v1.6 — 2026-11-25:** [Issue #6](https://github.com/MuhammadZidniirfan05-dot/batani-company/issues/6) menyelaraskan Planner → Worker dalam chat yang sama dengan pemilihan model dan catatan per tahap; Reviewer mahal memakai chat lain. Untuk aplikasi nanti: Planner mahal membuat Issue, Worker murah membaca/mengerjakan/mengetes, Reviewer mahal menilai dan mengirim koreksi pada PR yang sama. Fondasi workflow tetap seluruhnya target mahal. [Clean Architecture dan Clean Code](ARCHITECTURE.md#clean-architecture-dan-clean-code) wajib masuk Issue dan review. Catatan sesi terpisah pada snapshot lama di bawah berlaku saat itu; handoff aktif mengikuti [runbook](AGENT-WORKFLOW.md#handoff-satu-chat-dan-prompt). Ini belum penerimaan M0 atau izin coding aplikasi.

**Pembaruan penugasan 2026-11-25:** PRD v1.5 menetapkan seluruh pekerjaan workflow memakai `gpt-6-astra/high` pada peran terpisah, serta izin penyelesaian workflow lokal/GitHub. Model Worker murah pada catatan rencana lama di bawah telah diganti untuk tahap workflow; tetap berlaku untuk aplikasi nanti. [Issue #4](https://github.com/MuhammadZidniirfan05-dot/batani-company/issues/4) menugaskan evaluator offline dan penyelarasan kebijakan. Izin/persiapan kode belum menjadi bukti gate, isolasi atau M0 diterima. Coding aplikasi belum dimulai dan owner akan dikabari sebelum tahap itu.

## Milestone

| Milestone | Hasil | Dependensi / gate |
|---|---|---|
| M0 | Dokumen agent, kontrak Issue/PR, CI aman, runbook GitHub, bukti kompatibilitas | Review owner; repository dan kontrol terverifikasi sebelum disebut operasional |
| M1 | Laravel 13 + MySQL 8.x + Filament 5, auth/roles, CI aplikasi | M0 diterima dan kompatibilitas runtime PHP 8.5.12/dependensi/host diterima (§3) |
| M2 | Company/profile CMS, executive, experts, structure, goals, values, achievements, homepage content | Fondasi dan izin M1; FR-002–010, CMS-002–005 |
| M3 | News, satu bagian Publikasi dan Kajian, Project IT | Arsitektur publikasi dan izin; FR-011–013, CMS-006–008 |
| M4 | Search, contact, SEO | Konten/status M2–M3; FR-014–016, CMS-009/011 |
| M5 | UI modern minimalis, responsive, accessibility, security/regression | Fungsi utama tersedia; §8 dan penerimaan M0 sebelum desain |
| M6 | Staging UAT, backup/rollback, rilis dengan owner | Semua gate kualitas dan production approval; §11 |

M0 tidak membuat aplikasi, migrasi, resource Filament, UI, konten bisnis, search berbayar, atau deployment. Fase percakapan 3–4 menghasilkan paket fondasi; itu tidak otomatis menandakan seluruh milestone M0 diterima. Fase 5 memerlukan persetujuan owner terpisah.

Fase 4.5 menghubungkan folder lokal ke repository resmi yang dipilih owner. Setelah persetujuan publikasi, baseline main dan branch fondasi sudah tersedia, [draft PR #1](https://github.com/MuhammadZidniirfan05-dot/batani-company/pull/1) dibuat, dan CI push/pull_request berhasil pada head awal `f2e5512` serta head `1d6f1a9`. Bagian teknis repository/bootstrap M0-B sudah terbukti, tetapi penerimaan owner M0-A tetap terpisah. Pada 2026-11-25 owner mengubah repository menjadi public; API mengonfirmasi PUBLIC, proteksi main belum ada (HTTP 404 `Branch not protected`), dan rulesets kosong. Hambatan plan sebelumnya selesai, tetapi M0-C masih menunggu izin aktivasi proteksi dan reviewer independen. Snapshot sebelum publikasi pembaruan masih memakai check `M0 validation` sukses pada `1d6f1a9`; hasil itu tidak memvalidasi paket PHP 8.5.12 dan PRD v1.4. Owner kemudian mengizinkan commit/push paket pada branch yang sama, pembaruan deskripsi PR #1, dan pemeriksaan CI baru; SHA serta hasil aktual dicatat pada PR setelah publikasi. M0-D/F/G belum diaktifkan; gate teknologi M0-E belum lulus. Bukti dan rencana konfigurasi: [AGENT-WORKFLOW](AGENT-WORKFLOW.md), mengacu PRD §§3, 9.5, 11, 13. Tidak ada izin memulai Fase 5.

## Hasil parsial M0-D, 2026-11-25

Owner meminta melanjutkan tugas berikutnya tanpa mengulang review paket dokumentasi. Tidak ada verdict APPROVED atau penerimaan M0 yang diklaim; PR tetap draft. Tindak lanjut setelah snapshot di atas menyelesaikan bagian label M0-D sesuai PRD §9.5: 19 label baru dibuat, seluruh 20 label target tersedia, dan 10 label lama dipertahankan tanpa perubahan. Total label repository menjadi 29; nama, warna, dan deskripsi diperiksa kembali melalui API.

GitHub Projects masih BLOCKED pada akses: `gh project list` mengembalikan exit 1 karena scope `read:project` belum tersedia. Keberadaan board belum dapat diperiksa; field/status, simulasi transisi, ownership item, dan aturan closure dokumentasi belum selesai. Petunjuk akses operator dan bukti ada pada [AGENT-WORKFLOW](AGENT-WORKFLOW.md). Tidak ada Issue, item percobaan, commit/push baru, perubahan proteksi, merge, deployment, atau Fase 5 dalam penugasan ini. Catatan ini adalah pembaruan lokal setelah head `38a670a`.

## Tindak lanjut konfigurasi Projects M0-D, 2026-11-25

Hambatan scope Projects pada snapshot sebelumnya sudah teratasi melalui otorisasi owner dan pembacaan/mutasi API yang berhasil. [Board Batani](https://github.com/users/MuhammadZidniirfan05-dot/projects/2) dibuat private, tertaut ke repository resmi, memiliki 12 status PRD §9.2 serta Priority, Risk, Module, Agent owner, PRD reference dan Dependencies. View board memakai kolom Status. Enam aturan otomatis bawaan pada board baru dihapus; tidak ada auto-close atau perpindahan DONE saat merge. Board proyek lama dipertahankan dan diverifikasi identik. Bukti API dan batas pemeriksaan ada pada [AGENT-WORKFLOW](AGENT-WORKFLOW.md).

M0-D kini mempunyai label dan konfigurasi board yang aktif; seluruh transisi dan handoff tetap manual. Penerimaan M0-D belum lengkap: simulasi tugas nyata, ownership item, serta keputusan owner atas closure dokumentasi masih pending. Tidak dibuat Issue atau item percobaan. Publisher tepercaya/isolasi izin M0-F, proteksi dan pengujian gate M0-C, serta validasi teknologi M0-E tetap belum selesai; board bukan bukti kontrol merge atau agent otomatis.

Langkah berikut sesuai PRD §§9.2–9.5, 11: Planner menyiapkan penyelesaian acceptance criteria M0-D dan rancangan M0-F, termasuk usulan closure dokumentasi untuk keputusan owner, batas kepercayaan publisher, pemisahan kredensial, serta rencana uji kegagalan/pemalsuan/replay/head-base berubah. Implementasi integrasi dan uji dengan Issue nyata tetap memerlukan penugasan yang mengizinkannya. Tidak ada izin merge, deployment atau Fase 5. Catatan tambahan ini tetap lokal setelah head `38a670a`; dua perubahan dokumentasi terdahulu dipertahankan, tanpa commit/push baru.

## Backlog rancangan lokal

ID berikut adalah ID rencana, bukan nomor atau Issue GitHub. Tidak ada Issue yang diterbitkan. Konversi melalui [ISSUE-GUIDELINES](ISSUE-GUIDELINES.md) hanya setelah owner mengizinkan fase berikutnya.

| ID / scope kecil | Dependensi | Kriteria selesai dan bukti | Acuan PRD |
|---|---|---|---|
| M0-A: review dan penerimaan paket Fase 3–4 | Berkas dan hasil validasi lokal | Owner mencatat keputusan atas diff dan batas fase; temuan ditutup | §9.6, §11 |
| M0-B: repository, remote, hak akses, bootstrap main | Keputusan owner atas nama/visibility/plan; M0-A | URL/permission terverifikasi; baseline main sesuai; PR feature dapat dibuat tanpa force-push | §9.5, §13 |
| M0-C: jalankan CI dan enforce checks/review | M0-B, izin admin; finalisasi setelah publisher/gate M0-F teruji | CI dan `Agent review` aktual lulus; PR dengan hasil gagal/hilang/usang/tidak tepercaya tertahan; proteksi terverifikasi | §9.5, §11 |
| M0-D: labels, Projects, transisi dan ownership | M0-B, izin Projects | Label dan seluruh status tersedia; simulasi transisi tercatat; aturan DONE dokumentasi diputuskan | §9.2–9.5 |
| M0-E: validasi runtime dan dependensi PHP 8.5.12 | Paket/extension/test runner kandidat; lingkungan uji | Install tanpa bypass, platform check dan tes nyata berhasil; host mendukung atau blocker dicatat | §3, §9.6 |
| M0-F: integrasi Planner/Executor/Reviewer dan publisher | M0-B/D, rancangan M0-C, keputusan model/biaya/izin | Agent/sesi terpisah, satu akun GitHub boleh; publisher/isolasi izin teruji; tugas percobaan Issue → PR → CI → review → rework PR yang sama; SHA/log/model/biaya tercatat | §2, §9.1–9.5 |
| M0-G: rancangan release controls | Host/plan, M0-C | Pemisahan kewenangan, staging, approval, backup/rollback direview; template tetap disabled | §8, §9.6, §11 |

M0-E dapat diteliti sambil dokumentasi berjalan. Bukti end-to-end tidak boleh diklaim hanya dari formulir, akun CLI, atau YAML. Jika gate runtime belum lulus, M1 tetap tertahan walaupun dokumen M0 selesai.

Keputusan workflow owner 2026-11-25 pada PRD §13 menggantikan usulan wajib satu approval dari akun GitHub lain. Pilihan model telah disepakati: terapkan Planner/Reviewer `gpt-6-astra` / `high` dan Executor/Worker `gpt-6.1-sol` / `medium` pada agent/sesi terpisah; catat bukti model dan reasoning aktual serta siapkan handoff. Implementasikan publisher `Agent review` tepercaya dan pemisahan izin; buktikan CI gagal, review ditolak, status hilang/usang, serta pemalsuan/replay tetap menahan merge. Finalisasi proteksi M0-C setelah pengujian integrasi M0-F dan otorisasi owner; M0-F memakai rancangan M0-C agar dependensi tidak melingkar. Akun GitHub kedua tidak wajib. Seluruh integrasi tersebut masih pending dan tidak mengizinkan Fase 5.

Tampilan publik menggunakan Laravel Blade sesuai penegasan owner pada PRD §§3, 13. Implementasi tampilan menunggu workflow berjalan dan M0 diterima; desain tetap mengikuti milestone M5 dan otorisasi fase berikutnya.

Keputusan owner 2026-11-24 mengganti target PHP 8.6 menjadi **8.5.12** (PRD §13). Perubahan ini memperbarui sasaran M0-E, tetapi tidak meluluskan gate teknologi maupun membuka Fase 5. Bukti terbaru dan ketidaksamaan runtime terminal ada di [PHP-COMPATIBILITY](PHP-COMPATIBILITY.md).

## Penerimaan dan blocker

Owner perlu menerima arsitektur, pembagian izin, nama repository/plan, mekanisme agent dan batas biaya, hasil kompatibilitas, serta aturan closure dokumentasi. Detail status akses dan kontrol di [AGENT-WORKFLOW](AGENT-WORKFLOW.md); bukti runtime di [PHP-COMPATIBILITY](PHP-COMPATIBILITY.md).

Belum ada tanggal, anggaran, hosting, konten perusahaan, atau jadwal rilis yang disetujui. Planner harus memecah backlog menjadi kontrak Issue lengkap sebelum READY; tabel ini tidak menggantikan kontrak tersebut.

## Rencana penerimaan M0-D dan paket M0-F, 2026-11-25

[Rencana rinci](M0-D-M0-F-PLAN.md) mengacu PRD §§9.2–9.5, 11 dan 13. D-AC1/2 (konfigurasi label/board) sudah dibuktikan; D-AC3/4/5/6 (keputusan closure, simulasi, ownership/handoff nyata, penerimaan owner) masih pending. Demonstrasi D-AC5 dilaksanakan bersama F-AC7 agar dependensi M0-D/F tidak melingkar. Rencana ini tidak menetapkan M0 selesai.

Urutan usulan: F0 keputusan owner → F1 simulator offline → F2 adapter/publisher yang belum aktif → F3 pengujian integrasi/gate M0-C berizin → F4 demonstrasi tugas nyata → M0-ACCEPT. Seluruh ID adalah backlog lokal, bukan Issue; F1–F4 belum READY. Worker F1 ditargetkan `gpt-6.1-sol/medium`, Reviewer terpisah `gpt-6-astra/high`; identitas aktual tetap wajib dibuktikan. Publikasi, App/secret/proteksi dan tindakan GitHub dikerjakan operator melalui penugasan terpisah, tanpa credential tersebut di Worker.

Usulan D-DEC-1 dokumentasi murni tidak otomatis berlaku untuk PR #1 yang berisi konfigurasi/validator. Publisher dan pengikatan H/B/M belum teruji; salah sumber, hasil usang, race atau kegagalan pencabutan yang belum tertutup menahan aktivasi. Validasi teknologi M0-E tetap wajib sebelum M1. Tidak membuat Issue, mengaktifkan integrasi/proteksi, push, merge, deploy atau memulai Fase 5 dalam tugas perencanaan ini.
