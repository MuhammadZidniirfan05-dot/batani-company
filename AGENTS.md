# Instruksi wajib untuk agent

Acuan: [PRD](docs/PRD.md) §§3, 9, 11, 13. Berlaku untuk seluruh repository dan semua model AI.

## Sebelum bekerja

1. Baca seluruh [PRD](docs/PRD.md), [README](README.md), berkas ini, dan GitHub Issue yang ditugaskan. Periksa acceptance criteria, dependensi, risiko, dan batas scope.
2. Periksa status Git, branch, remote, perubahan yang sudah ada, dan instruksi tambahan di direktori yang disentuh. Jangan menimpa pekerjaan orang lain.
3. Jadikan PRD baseline kebutuhan. Keputusan eksplisit terbaru dari owner harus dicatat dengan bukti; jangan mengubah kebutuhan diam-diam. Konflik yang belum diputuskan membuat pekerjaan terdampak BLOCKED.
4. Jangan mengarang Issue, izin, hasil tes, status CI, atau persetujuan. Baca sumber dan diff aktual.

## Batas pekerjaan

- Keputusan owner 2026-11-25 pada PRD §13 memperbolehkan satu akun GitHub. Planner, Executor, dan Reviewer wajib agent/sesi terpisah; jangan mereview implementasi sendiri sebagai review independen.
- Catat ID agent/sesi, model aktual, dan reasoning jika tersedia. Pilihan owner 2026-11-25 pada PRD §§9.1, 13 adalah Planner dan Reviewer `gpt-6-astra` / `high`, serta Executor/Worker `gpt-6.1-sol` / `medium`, masing-masing pada agent/sesi terpisah. Reviewer menggunakan tingkat reasoning dan kelas biaya lebih tinggi daripada Executor berdasarkan pilihan ini. Konfigurasi target tidak menggantikan bukti model, reasoning, dan sesi aktual setiap run.
- Tampilan publik menggunakan Laravel Blade yang sudah ada pada baseline dan ditegaskan kembali oleh owner pada 2026-11-25 (PRD §§3, 13). Implementasi tampilan ditunda sampai workflow berjalan dan M0 diterima; keputusan ini tidak mengizinkan scaffolding atau Fase 5.
- Approval native dari akun kedua bukan gate wajib. Gate yang direncanakan adalah CI terbaru dan status `Agent review` yang diterbitkan secara tepercaya untuk head/base yang masih berlaku. Komentar AI saja tidak mengaktifkan gate.
- Executor tidak boleh menerbitkan status kelulusan review, memperoleh kredensial publisher/admin/production dalam lingkungan eksekusinya, atau melewati hasil yang gagal, hilang, usang, dan belum terverifikasi. Pemisahan izin dan integrasi ini belum diimplementasikan.
- Kerjakan hanya scope Issue yang READY. Usulan di luar scope masuk keputusan/backlog, bukan langsung diimplementasikan.
- Gunakan branch khusus: `feature/<issue>-<slug>`, `fix/<issue>-<slug>`, atau `chore/<issue>-<slug>` dari baseline yang disepakati.
- Jangan push langsung ke protected `main`, force-push, merge, atau mengubah proteksi tanpa otorisasi owner. Jangan menghapus branch atau pekerjaan lain.
- Jangan mengubah [PRD](docs/PRD.md) tanpa keputusan perubahan yang eksplisit. PHP **8.5.12** adalah target resmi pengganti 8.6 berdasarkan instruksi owner pada 2026-11-24, dicatat pada PRD §13. Laravel 13 dan Filament 5 tetap menunggu gate kompatibilitas. Keputusan versi ini mengizinkan penyelarasan dokumentasi M0, bukan scaffolding atau Fase 5.
- Selama M0: tidak ada scaffolding Laravel/Filament, migrasi, halaman publik, desain, atau deployment. Penerimaan fondasi dan validasi teknologi mendahului M1.
- Jangan membuat Issue baru dalam penugasan Fase 3–4 saat ini. Pengecualian bootstrap ini berasal dari instruksi langsung owner: branch `chore/m0-workflow-foundation` boleh menyiapkan fondasi tanpa nomor Issue. Catat otorisasi tersebut; jangan memakai nomor palsu. Pekerjaan berikutnya kembali memakai Issue setelah owner mengizinkan fase selanjutnya.
- Otorisasi owner Fase 4.5 (2026-11-24) memperluas bootstrap hanya untuk integrasi repository resmi `MuhammadZidniirfan05-dot/batani-company`, pemeriksaan akses/konfigurasi, dan persiapan PR M0 pada branch yang sama. Minta persetujuan sebelum push atau perubahan riwayat remote. Jangan membuat repository/Issue baru, menghapus commit/branch, force-push, merge, deploy, atau melanjutkan Fase 5. Bukti dan rencana publikasi ada di [AGENT-WORKFLOW](docs/AGENT-WORKFLOW.md).

## Keamanan dan izin

- Jangan membaca/mencetak/commit token, password, private key, isi `.env`, atau data rahasia. Gunakan contoh yang jelas nonrahasia; redaksi bukti sebelum dibagikan.
- Executor tidak mendapat kredensial production. PR dari fork atau kode tidak tepercaya tidak boleh memperoleh secret atau token tulis.
- Jangan menjalankan kode PR dengan `pull_request_target` atau runner deployment yang menyimpan kredensial. Pertahankan permissions minimal dan action yang dikunci ke commit SHA.
- Jangan deploy staging maupun production pada Fase 3–4. Setiap deployment memerlukan otorisasi owner sesuai scope. Pada fase rilis, production tetap memerlukan persetujuan manusia terpisah, staging terverifikasi, backup, dan rollback.
- Komentar AI `APPROVED`, tombol manual workflow, dan YAML environment bukan bukti bahwa kontrol GitHub sudah aktif.

## Pengujian dan penyerahan

- Jalankan pemeriksaan yang sesuai dengan berkas yang benar-benar ada. Untuk fondasi saat ini, dari root:

  ```text
  npm ci --prefix .github/validation --ignore-scripts --no-audit --no-fund
  node .github/validation/validate.mjs
  git diff --check
  ```

- Paket Node tersebut hanya tooling validasi M0, bukan scaffolding frontend. Belum ada perintah tes Laravel atau build aplikasi yang dapat dijalankan.
- Catat perintah, versi runtime, hasil/exit code, keterbatasan, dan commit yang diperiksa. Log lokal tidak boleh disebut hasil GitHub Actions.
- Gunakan [template PR](.github/PULL_REQUEST_TEMPLATE.md), tautkan Issue nyata saat tersedia, referensi bagian PRD, scope, risiko, dan bukti. Ikuti [checklist review](docs/REVIEW-CHECKLIST.md).
- Jika CHANGES_REQUESTED, perbaiki branch dan PR yang sama, jalankan ulang pemeriksaan terdampak, lalu minta review pada commit terbaru.
- Hasil Reviewer wajib `APPROVED`, `CHANGES_REQUESTED`, atau `BLOCKED`, disertai PR, head/base SHA, identitas sesi/model, dan CI aktual. `CHANGES_REQUESTED` harus berisi severity, lokasi, alasan, koreksi, verifikasi, serta prompt siap salin untuk Executor. Koreksi dan review ulang menggunakan PR yang sama.
- Akhiri dengan status terpisah: dibuat, tervalidasi lokal, aktif di GitHub, manual/pending, dan blocker. Fase 3–4 maupun integrasi Fase 4.5 berhenti sebelum Fase 5.

## Pembagian tanggung jawab

Planner merancang dan memecah scope; Executor mengimplementasikan; Reviewer mengevaluasi secara terpisah; Human Owner memegang keputusan kebutuhan, risiko tinggi, akses, dan rilis. Handoff, transisi, dan konfigurasi ada di [AGENT-WORKFLOW](docs/AGENT-WORKFLOW.md). Bahasa komunikasi proyek: Bahasa Indonesia.
