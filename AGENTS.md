# Instruksi wajib untuk agent

Acuan: [PRD](docs/PRD.md) §§3, 9, 11, 13. Berlaku untuk seluruh repository dan semua model AI.

## Sebelum bekerja

1. Baca seluruh [PRD](docs/PRD.md), [README](README.md), berkas ini, dan GitHub Issue yang ditugaskan. Periksa acceptance criteria, dependensi, risiko, dan batas scope.
2. Periksa status Git, branch, remote, perubahan yang sudah ada, dan instruksi tambahan di direktori yang disentuh. Jangan menimpa pekerjaan orang lain.
3. Jadikan PRD baseline kebutuhan. Keputusan eksplisit terbaru dari owner harus dicatat dengan bukti; jangan mengubah kebutuhan diam-diam. Konflik yang belum diputuskan membuat pekerjaan terdampak BLOCKED.
4. Jangan mengarang Issue, izin, hasil tes, status CI, atau persetujuan. Baca sumber dan diff aktual.

## Batas pekerjaan

- Kerjakan hanya scope Issue yang READY. Usulan di luar scope masuk keputusan/backlog, bukan langsung diimplementasikan.
- Gunakan branch khusus: `feature/<issue>-<slug>`, `fix/<issue>-<slug>`, atau `chore/<issue>-<slug>` dari baseline yang disepakati.
- Jangan push langsung ke protected `main`, force-push, merge, atau mengubah proteksi tanpa otorisasi owner. Jangan menghapus branch atau pekerjaan lain.
- Jangan mengubah [PRD](docs/PRD.md) tanpa keputusan perubahan yang eksplisit. PHP 8.6 tetap target; Laravel 13 dan Filament 5 menunggu gate kompatibilitas.
- Selama M0: tidak ada scaffolding Laravel/Filament, migrasi, halaman publik, desain, atau deployment. Penerimaan fondasi dan validasi teknologi mendahului M1.
- Jangan membuat Issue baru dalam penugasan Fase 3–4 saat ini. Pengecualian bootstrap ini berasal dari instruksi langsung owner: branch `chore/m0-workflow-foundation` boleh menyiapkan fondasi tanpa nomor Issue. Catat otorisasi tersebut; jangan memakai nomor palsu. Pekerjaan berikutnya kembali memakai Issue setelah owner mengizinkan fase selanjutnya.

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
- Akhiri dengan status terpisah: dibuat, tervalidasi lokal, aktif di GitHub, manual/pending, dan blocker. Fase 3–4 berhenti sebelum Fase 5.

## Pembagian tanggung jawab

Planner merancang dan memecah scope; Executor mengimplementasikan; Reviewer mengevaluasi secara terpisah; Human Owner memegang keputusan kebutuhan, risiko tinggi, akses, dan rilis. Handoff, transisi, dan konfigurasi ada di [AGENT-WORKFLOW](docs/AGENT-WORKFLOW.md). Bahasa komunikasi proyek: Bahasa Indonesia.
