# Kontrak GitHub Issue

Acuan: [PRD](PRD.md) §§9.3, 9.6, 11, 13. Tidak ada GitHub Issue yang dibuat dalam Fase 3–4. Dokumen ini dan tiga form adalah persiapan untuk fase yang disetujui berikutnya.

## Isi wajib

Setiap Issue berisi judul terukur, manfaat pengguna/bisnis, tujuan teknis, referensi bagian PRD atau ID FR/CMS, scope, out-of-scope, dependensi, komponen/berkas yang diperkirakan, acceptance criteria, rencana tes, risiko keamanan, prioritas, tingkat risiko, pemilik agent, dan Definition of Done. Bila suatu bagian tidak berlaku, tulis N/A dengan alasan; jangan kosongkan.

Gunakan [feature](../.github/ISSUE_TEMPLATE/feature.yml), [bug](../.github/ISSUE_TEMPLATE/bug.yml), atau [chore](../.github/ISSUE_TEMPLATE/chore.yml). Bug juga memuat reproduksi, expected/actual, dan lingkungan. Chore harus menyebut alasan pemeliharaan. Form tidak menetapkan username/Project ID yang belum diketahui. Label tipe harus disiapkan admin dahulu.

## Acceptance criteria yang dapat diperiksa

- Satu item mempunyai kondisi dan hasil teramati; tambahkan langkah verifikasi dan bukti yang diperlukan.
- Rujuk `docs/PRD.md §9.6` untuk fondasi atau ID spesifik seperti `FR-015` untuk fungsi. Jangan menulis hanya "sesuai PRD".
- Contoh M0: "Ketika validator dijalankan pada YAML dengan key duplikat, exit code bukan 0 dan lokasi kesalahan dilaporkan" (PRD §9.6).
- Contoh nanti: "Pengguna publik tidak menemukan draft berita dalam hasil pencarian maupun URL detail" (FR-011, FR-015, PRD §8).
- Hindari "buat website", "aman", atau "bagus" tanpa batas dan bukti. Feature aplikasi belum boleh READY sebelum gate M0/runtime.
- Bagi pekerjaan agar satu Issue memiliki hasil dan tanggung jawab yang jelas. Nyatakan batas folder/komponen dan kualitas yang dapat diperiksa: struktur serta penamaan mengikuti proyek, tidak ada duplikasi/dead code/berkas sementara/secret, dan abstraksi atau dependency baru memerlukan alasan. Untuk aplikasi setelah M0 diterima, ikuti konvensi Laravel tanpa membuat scaffolding sekarang. Rencana tes harus sesuai perilaku dan risiko, bukan sekadar menjalankan perintah.

## READY dan ownership

Planner memeriksa kelengkapan dan ukuran tugas, lalu owner/maintainer yang berwenang menetapkan READY setelah dependensi selesai dan keputusan berisiko disetujui. Cantumkan Executor yang ditugaskan, Reviewer terpisah, dan owner keputusan. Prioritas P0–P3 dan risiko low/medium/high memakai definisi [runbook](AGENT-WORKFLOW.md).

Handoff mencatat agent/sesi Planner, Executor, dan Reviewer yang terpisah, model aktual, serta dasar pilihan Reviewer pada tingkat reasoning dan kelas biaya lebih tinggi. Akun GitHub boleh sama. Acceptance criteria untuk pekerjaan integrasi review harus menguji penolakan pada hasil gagal, hilang, usang, dan tidak tepercaya; komentar APPROVED saja bukan bukti gate aktif. Acuan: PRD §§9.1, 9.3–9.5, 11, 13.

Sebelum masing-masing peran bekerja, catat ID sesi, model dan reasoning aktual bila tersedia; target Planner/Reviewer `gpt-6-astra` / `high`, Worker `gpt-6.1-sol` / `medium`. Bila mismatch diketahui, ingatkan owner tentang target, aktual, dan perpindahan sesi/peran yang diperlukan. Bila metadata tidak tersedia, tulis **belum terverifikasi** dan minta pemeriksaan pemilih model. Target pada kontrak Issue tidak membuktikan model run. Reviewer harus memakai sesi lain walaupun modelnya sama dengan Planner; Worker tidak mereview pekerjaannya sendiri.

Issue yang belum memiliki jawaban untuk dependensi kritis tetap BACKLOG atau BLOCKED, disertai alasan dan pihak pembuka hambatan. Jangan melewati pemeriksaan hanya karena field form terisi. Form mewajibkan input, tetapi tidak membuktikan isinya benar atau memenuhi acceptance criteria.

## PR dan closure

Gunakan branch khusus dan satu PR untuk satu scope yang jelas. Tulis `Refs #<nomor-nyata>` agar merge tidak otomatis menutup Issue sebelum tahapan release yang diwajibkan. Jangan memakai nomor contoh sebagai tautan nyata. Kaitkan setiap acceptance criterion dengan bukti dalam [template PR](../.github/PULL_REQUEST_TEMPLATE.md).

Untuk bootstrap Fase 3–4 ini saja, otorisasi langsung owner menggantikan penugasan Issue; jangan membuat Issue atau PR remote pada fase ini. Jika nanti owner mengizinkan registrasi pekerjaan bootstrap, tambahkan tautan Issue yang benar tanpa mengarang riwayat review.

Untuk rejected review, lanjutkan Issue dan PR yang sama, bukan membuat duplikat. Format koreksi di [REVIEW-CHECKLIST](REVIEW-CHECKLIST.md). Closure DONE untuk perubahan tanpa deployment menunggu keputusan owner; jangan mencatat staging/deployment palsu (PRD §§9.2, 11).

Alur handoff manual: Planner menyiapkan Issue terukur → owner/maintainer menetapkan READY → Worker mengerjakan dan menguji pada branch khusus → hasil, diff, SHA dan keterbatasan diserahkan lewat PR yang diizinkan → Reviewer terpisah memeriksa AC, diff dan CI aktual → bila ditolak, Worker memperbaiki Issue/PR yang sama dan meminta review ulang pada head/base terbaru. Owner/maintainer mencatat transisi; belum ada bot yang mengerjakannya. Penerbitan status `Agent review`, proteksi dan pemisahan kredensial tetap memerlukan integrasi serta verifikasi terpisah; komentar review bukan gate merge.
