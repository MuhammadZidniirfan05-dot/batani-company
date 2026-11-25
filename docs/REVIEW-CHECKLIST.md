# Review, penolakan, dan bukti

Acuan: [PRD](PRD.md) §§9.1, 9.4–9.5, 11, 13. Reviewer memeriksa Issue, PR, diff aktual, dan hasil pemeriksaan untuk commit terbaru. Review ini adalah peran terpisah dari Executor; review mandiri tidak boleh disebut approval independen.

Planner, Executor, dan Reviewer wajib agent/sesi berbeda; satu akun GitHub diperbolehkan. Catat identitas sesi/model aktual serta reasoning bila tersedia. Pilihan owner adalah Planner/Reviewer `gpt-6-astra` / `high` dan Executor/Worker `gpt-6.1-sol` / `medium` (PRD §§9.1, 13). Bila bukti aktual belum tersedia atau tidak sesuai, nyatakan keterbatasannya sebelum review penerimaan. Laporan agent bukan approval native GitHub atau bukti status `Agent review` sudah aktif.

Sebelum menjalankan peran Reviewer, sebutkan ID sesi, model/reasoning aktual jika tersedia dan bandingkan dengan target. Bila berbeda, ingatkan owner dengan expected/actual dan perpindahan peran/sesi yang diperlukan. Bila metadata tidak tersedia, tulis **belum terverifikasi** dan minta pemeriksaan pemilih model; nama model pada instruksi tidak membuktikan run aktual. Reviewer tidak boleh menjadi sesi Worker yang membuat patch.

Handoff manual sebelum review: Planner menyusun Issue terukur, owner/maintainer menetapkan READY, Worker mengerjakan dan menguji branch, lalu menyerahkan diff dan bukti melalui PR yang diizinkan. Reviewer terpisah memeriksa AC, diff serta CI aktual; bila CHANGES_REQUESTED, Worker memperbaiki Issue dan PR yang sama dan menyerahkan head/base terbaru untuk review ulang. Tidak ada bot atau komentar `APPROVED` yang menggantikan status `Agent review` tepercaya.

## Urutan review

1. Verifikasi referensi PRD, scope Issue, dependensi, identitas branch, dan SHA yang direview.
2. Periksa CI untuk SHA tersebut. CI gagal/kedaluwarsa atau bukti belum tersedia tidak boleh dilaporkan sebagai lulus. Jalankan pemeriksaan lokal bila perlu, lalu bedakan bukti lokal dan GitHub.
3. Cocokkan setiap acceptance criterion dengan implementasi dan bukti, termasuk jalur gagal dan regresi yang relevan.
4. Periksa keamanan, data migration (atau N/A dengan alasan), dokumentasi, dan keterbatasan.
5. Berikan satu verdict dengan temuan yang dapat ditindaklanjuti. CI murah mendahului review penalaran mahal; pemeriksaan awal saat CI blocked harus diberi label belum final.

## Checklist

- [ ] Scope dan referensi PRD tepat; tidak ada perubahan requirement diam-diam.
- [ ] Struktur mengikuti repository/framework; tanggung jawab tiap modul jelas; nama konsisten; tidak ada duplikasi, dead code, berkas sementara atau abstraksi/dependency tanpa kebutuhan dalam scope.
- [ ] Correctness diperiksa terhadap AC dan jalur gagal yang relevan; format mengikuti tooling yang ada dan tes memeriksa perilaku sesuai risiko.
- [ ] Bukti sesi/model/reasoning sesuai pilihan owner pada PRD §9.1, dengan setiap peran pada agent/sesi terpisah; konfigurasi target saja tidak memenuhi bukti review penerimaan.
- [ ] Issue nyata tersedia, atau otorisasi bootstrap Fase 3–4 / integrasi Fase 4.5 dicatat tanpa nomor palsu; persetujuan push diperiksa terpisah.
- [ ] Acceptance criteria dipetakan ke bukti pada SHA terbaru.
- [ ] Tes yang diklaim benar-benar berjalan; Laravel/frontend tidak diklaim berjalan dalam M0.
- [ ] Tidak ada secret, token production, input PR yang disisipkan ke shell, atau izin tulis berlebihan.
- [ ] YAML/form/tautan valid; action dikunci SHA; nama check sesuai runbook.
- [ ] Workflow deployment hanya template yang diblokir, tidak mengambil secret/environment dan tidak deploy.
- [ ] Risiko, rollback/dampak data, dan keterbatasan dijelaskan sesuai scope.
- [ ] Temuan review sebelumnya sudah diperbaiki dan diverifikasi ulang pada PR yang sama.
- [ ] Gate merge dan production tetap terpisah dari keputusan AI.
- [ ] Hasil review mengacu head/base terbaru; komentar `APPROVED` tidak dianggap status `Agent review`. Publisher, proteksi, dan isolasi yang belum teruji dinyatakan pending.

## Format verdict wajib

```text
VERDICT: APPROVED | CHANGES_REQUESTED | BLOCKED
Issue / otorisasi bootstrap:
PR / branch:
Reviewed commit SHA:
Base SHA:
Planner — ID agent/sesi/model:
Executor — ID agent/sesi/model:
Reviewer — ID agent/sesi/model/reasoning:
Dasar pemilihan tingkat reasoning dan kelas biaya Reviewer:
Referensi PRD:
Bukti yang diperiksa (perintah, exit code, URL run bila ada):
Acceptance criteria terpenuhi / belum terpenuhi:
Temuan:
  ID:
  Finding tepat:
  Berkas dan lokasi:
  Severity: critical | high | medium | low
  Alasan penolakan dan dampak terhadap requirement:
  Instruksi koreksi yang dapat dilaksanakan:
  Metode verifikasi dan expected result:
Blocker eksternal, penanggung jawab, dan bukti yang dibutuhkan:
Batas kesimpulan / risiko tersisa:
Prompt siap salin untuk Executor jika CHANGES_REQUESTED:
Status penerbitan Agent review — belum diterbitkan atau bukti aktual:
```

APPROVED berarti scope memenuhi acceptance criteria dan pemeriksaan yang diwajibkan untuk head/base itu; kelayakan merge memerlukan CI dan status review tepercaya yang masih berlaku serta proteksi aktif, bukan izin merge/deploy pada penugasan ini. CHANGES_REQUESTED berarti ada cacat yang dapat diperbaiki; semua field temuan dan prompt koreksi wajib diisi. BLOCKED berarti keputusan, akses, atau bukti penting belum tersedia; sebutkan pihak dan kondisi untuk melanjutkan. Jangan menganggap keterbatasan lingkungan sebagai bukti cacat kode tanpa reproduksi.

Severity: critical untuk bocornya secret/akses production tanpa izin; high untuk pelanggaran otorisasi atau requirement utama; medium untuk perilaku/validasi yang salah dengan dampak terbatas; low untuk masalah kecil yang tetap menghalangi acceptance criterion. Saran opsional harus ditandai non-blocking, bukan dibuat sebagai requirement baru.

## Siklus perbaikan

Executor mengakui tiap ID, mengubah branch/PR yang sama, menjalankan tes terdampak, dan mencatat SHA serta bukti baru. Reviewer terpisah memeriksa ulang temuan dan dampak perubahan. Perubahan head/base membatalkan kelulusan sebelumnya; publisher harus memverifikasi ulang sebelum menerbitkan `Agent review: success`. Maintainer memastikan required CI/review dan persetujuan risiko/merge yang relevan sebelum merge. Transisi lengkap: [AGENT-WORKFLOW](AGENT-WORKFLOW.md).

## Prompt koreksi siap salin

```text
Anda adalah Executor untuk memperbaiki PR yang sama.

Repository: <repository>
PR: <URL PR>
Branch: <branch>
Head yang direview: <SHA>
Base yang direview: <SHA>
Acuan PRD: <bagian/persyaratan>
Scope koreksi: <scope>

Baca PRD, README, AGENTS, Issue bila tersedia, diff aktual, dan laporan Reviewer.
Periksa perubahan setelah SHA yang direview; jangan menimpa pekerjaan lain.

Temuan wajib:
1. <severity; file/lokasi; masalah; alasan; koreksi; metode verifikasi>

Kerjakan koreksi dalam branch dan PR yang sama. Jalankan pemeriksaan yang relevan,
catat perintah/hasil/SHA, dan jelaskan keterbatasan. Jangan menyebut tes lokal
sebagai hasil CI remote.

Serahkan head terbaru, daftar koreksi, dan bukti pemeriksaan kepada Reviewer agent
terpisah untuk review ulang. Jangan menerbitkan sendiri kelulusan Agent review,
melewati gate, merge, deploy, atau melanjutkan fase tanpa izin.
```
