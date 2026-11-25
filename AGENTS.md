# Instruksi wajib untuk agent

Acuan: [PRD](docs/PRD.md) §§3, 9, 11, 13. Berlaku untuk seluruh repository dan semua model AI.

**Otorisasi aktif v1.7:** owner telah meminta mulai membangun Laravel melalui [Issue #8](https://github.com/MuhammadZidniirfan05-dot/batani-company/issues/8), dengan Executor kelas mahal (target proyek `gpt-6-astra/high`). Fondasi aplikasi lokal, Blade awal, konfigurasi MySQL, tes dan CI diizinkan sekarang. Ini menggantikan larangan scaffolding/Fase 5 dan target Worker murah di bawah hanya untuk penugasan ini. Gate merge/deploy, preservasi, keamanan, review terpisah serta kejujuran bukti tetap wajib; M0 tidak otomatis diterima. Jangan meminta ulang izin memulai scope Laravel ini.

## Sebelum bekerja

1. Baca seluruh [PRD](docs/PRD.md), [README](README.md), berkas ini, dan GitHub Issue yang ditugaskan. Periksa acceptance criteria, dependensi, risiko, dan batas scope.
2. Periksa status Git, branch, remote, perubahan yang sudah ada, dan instruksi tambahan di direktori yang disentuh. Jangan menimpa pekerjaan orang lain.
3. Jadikan PRD baseline kebutuhan. Keputusan eksplisit terbaru dari owner harus dicatat dengan bukti; jangan mengubah kebutuhan diam-diam. Konflik yang belum diputuskan membuat pekerjaan terdampak BLOCKED.
4. Jangan mengarang Issue, izin, hasil tes, status CI, atau persetujuan. Baca sumber dan diff aktual.
5. Sebutkan peran tugas, ID agent/sesi, model dan reasoning aktual jika metadata tersedia sebelum mengerjakan peran itu. Cocokkan dengan pilihan owner pada PRD §9.1. Jika diketahui berbeda, ingatkan owner dengan nilai target dan aktual serta perlunya berpindah ke sesi/peran yang sesuai sebelum pekerjaan peran tersebut. Jika metadata tidak tersedia, tulis **belum terverifikasi** dan minta pemeriksaan pemilih model; jangan menyimpulkan model aktual dari instruksi target.

## Batas pekerjaan

- Otorisasi workflow terbaru pada PRD §13 v1.5 mengizinkan penyelesaian workflow lokal dan GitHub yang diperlukan, termasuk Issue/PR, publikasi dan konfigurasi. Batas Fase 3–4/4.5 di bawah merupakan riwayat otorisasi awal; gunakan keputusan terbaru untuk tugas workflow yang kini diizinkan. Persyaratan keamanan, preservasi, pengujian, dan gate tetap berlaku. Kabari owner sebelum masuk coding aplikasi; jangan mulai aplikasi, deploy atau Fase 5.
- Keputusan owner 2026-11-25 pada PRD §13 v1.6 memperbolehkan satu akun GitHub dan Planner → Worker dalam chat/sesi yang sama. Reviewer memakai chat/sesi lain dari Planner/Worker; jangan mereview implementasi sendiri sebagai review independen.
- Catat peran, ID agent/sesi, run/turn bila tersedia atau waktu handoff, model/reasoning aktual dan sumber buktinya. Seluruh peran fondasi workflow tetap memakai `gpt-6-astra/high`, termasuk Worker tooling. Untuk aplikasi, Planner/Reviewer memakai `gpt-6-astra/high` dan Worker `gpt-6.1-sol/medium`. Setelah Issue READY, minta owner memilih model Worker sebelum implementasi di chat yang sama; prompt bukan bukti model telah berganti. Metadata yang tidak tersedia ditulis **belum terverifikasi**; konfirmasi pemilih model dari owner dicatat terpisah dari metadata runtime. Konfigurasi target tidak menggantikan bukti aktual setiap tahap.
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

## Standar struktur dan kualitas

- Ikuti struktur repository dan konvensi framework yang sudah ada. Beri setiap modul satu tanggung jawab yang jelas dan gunakan nama berkas, kelas, fungsi, serta istilah yang konsisten. Setelah M0 diizinkan berlanjut ke aplikasi, ikuti konvensi Laravel; aturan ini tidak mengizinkan pembuatan folder aplikasi sekarang.
- Terapkan Clean Architecture pragmatis menurut [ARCHITECTURE](docs/ARCHITECTURE.md): controller/Filament/Blade menangani input dan presentasi; alur bisnis berada pada use case/action/service yang terfokus; detail database, email dan storage tidak mencemari aturan bisnis murni. Arah dependensi UI menuju use case, bukan use case menuju UI. Jangan menambah lapisan, repository atau interface untuk setiap model tanpa kebutuhan nyata.
- Terapkan Clean Code: fungsi fokus, nama menjelaskan maksud, alur mudah dibaca, dependensi dan efek samping eksplisit. Validasi input dan otorisasi di server; tangani kegagalan tanpa menelan error atau membocorkan secret. Komentar menjelaskan alasan/kontrak, bukan mengulang kode. Hindari god class dan perubahan yang tidak terkait Issue.
- Jaga diff sesuai scope Issue: jangan meninggalkan duplikasi, dead code, berkas sementara, atau secret. Tambah abstraksi dan dependency hanya bila kebutuhan dalam scope dapat dijelaskan.
- Ikuti formatter/linter yang sudah tersedia. Pilih tes yang memeriksa perilaku dan risiko perubahan, termasuk jalur gagal yang relevan; laporkan keterbatasan bila tes yang sesuai belum tersedia.
- Dalam Issue/PR, jelaskan alur input → use case → penyimpanan/layanan luar, batas komponen yang berubah, alasan abstraksi baru, dan tes perilakunya; gunakan N/A beralasan untuk dokumentasi murni. Standar kualitas bukan izin refactor di luar scope.

## Pengujian dan penyerahan

- Jalankan pemeriksaan yang sesuai dengan berkas yang benar-benar ada. Untuk fondasi saat ini, dari root:

  ```text
  npm ci --prefix .github/validation --ignore-scripts --no-audit --no-fund
  node .github/validation/validate.mjs
  node --permission --allow-fs-read=tools/agent-review tools/agent-review/test/policy.test.mjs
  git diff --check
  ```

- Paket Node di `.github/validation` tetap tooling M0. Setelah scaffold Issue #8 tersedia, jalankan juga Composer validate/platform check/audit, Pint, tes Laravel dan build frontend sesuai [panduan lokal](docs/LOCAL-DEVELOPMENT.md). Gunakan PHP 8.5.12 secara eksplisit bila PATH berbeda; jangan menjalankan migrasi pada database existing tanpa penugasan.
- Catat perintah, versi runtime, hasil/exit code, keterbatasan, dan commit yang diperiksa. Log lokal tidak boleh disebut hasil GitHub Actions.
- Gunakan [template PR](.github/PULL_REQUEST_TEMPLATE.md), tautkan Issue nyata saat tersedia, referensi bagian PRD, scope, risiko, dan bukti. Ikuti [checklist review](docs/REVIEW-CHECKLIST.md).
- Jika CHANGES_REQUESTED, perbaiki branch dan PR yang sama, jalankan ulang pemeriksaan terdampak, lalu minta review pada commit terbaru.
- Hasil Reviewer wajib `APPROVED`, `CHANGES_REQUESTED`, atau `BLOCKED`, disertai PR, head/base SHA, identitas sesi/model, dan CI aktual. `CHANGES_REQUESTED` harus berisi severity, lokasi, alasan, koreksi, verifikasi, serta prompt siap salin untuk Executor. Koreksi dan review ulang menggunakan PR yang sama.
- Akhiri dengan status terpisah: dibuat, tervalidasi lokal, aktif di GitHub, manual/pending, dan blocker. Fase 3–4 maupun integrasi Fase 4.5 berhenti sebelum Fase 5.

## Pembagian tanggung jawab

Planner merancang dan memecah scope; Executor mengimplementasikan; Reviewer mengevaluasi secara terpisah; Human Owner memegang keputusan kebutuhan, risiko tinggi, akses, dan rilis. Handoff, transisi, dan konfigurasi ada di [AGENT-WORKFLOW](docs/AGENT-WORKFLOW.md). Bahasa komunikasi proyek: Bahasa Indonesia.

Alur manual: Planner mahal menyiapkan Issue terukur → owner/maintainer menetapkan READY → pilih model Worker sesuai tahap dan lanjutkan dalam chat yang sama → Worker membaca Issue, mengerjakan dan menguji branch Issue → hasil, diff dan bukti diserahkan lewat PR yang diizinkan → Reviewer mahal di chat lain memeriksa AC, arsitektur, clean code, diff dan CI aktual → bila CHANGES_REQUESTED, Worker memperbaiki Issue/PR yang sama dan meminta review ulang pada head/base terbaru. Tidak ada pergantian model/status otomatis atau izin merge dari komentar AI.
