# Review, penolakan, dan bukti

Acuan: [PRD](PRD.md) §§9.1, 9.4–9.5, 11, 13. Reviewer memeriksa Issue, PR, diff aktual, dan hasil pemeriksaan untuk commit terbaru. Review ini adalah peran terpisah dari Executor; review mandiri tidak boleh disebut approval independen.

## Urutan review

1. Verifikasi referensi PRD, scope Issue, dependensi, identitas branch, dan SHA yang direview.
2. Periksa CI untuk SHA tersebut. CI gagal/kedaluwarsa atau bukti belum tersedia tidak boleh dilaporkan sebagai lulus. Jalankan pemeriksaan lokal bila perlu, lalu bedakan bukti lokal dan GitHub.
3. Cocokkan setiap acceptance criterion dengan implementasi dan bukti, termasuk jalur gagal dan regresi yang relevan.
4. Periksa keamanan, data migration (atau N/A dengan alasan), dokumentasi, dan keterbatasan.
5. Berikan satu verdict dengan temuan yang dapat ditindaklanjuti. CI murah mendahului review penalaran mahal; pemeriksaan awal saat CI blocked harus diberi label belum final.

## Checklist

- [ ] Scope dan referensi PRD tepat; tidak ada perubahan requirement diam-diam.
- [ ] Issue nyata tersedia, atau otorisasi bootstrap Fase 3–4 dicatat tanpa nomor palsu.
- [ ] Acceptance criteria dipetakan ke bukti pada SHA terbaru.
- [ ] Tes yang diklaim benar-benar berjalan; Laravel/frontend tidak diklaim berjalan dalam M0.
- [ ] Tidak ada secret, token production, input PR yang disisipkan ke shell, atau izin tulis berlebihan.
- [ ] YAML/form/tautan valid; action dikunci SHA; nama check sesuai runbook.
- [ ] Workflow deployment hanya template yang diblokir, tidak mengambil secret/environment dan tidak deploy.
- [ ] Risiko, rollback/dampak data, dan keterbatasan dijelaskan sesuai scope.
- [ ] Temuan review sebelumnya sudah diperbaiki dan diverifikasi ulang pada PR yang sama.
- [ ] Gate merge dan production tetap terpisah dari keputusan AI.

## Format verdict wajib

```text
VERDICT: APPROVED | CHANGES_REQUESTED | BLOCKED
Issue / otorisasi bootstrap:
PR / branch:
Reviewed commit SHA:
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
```

APPROVED berarti scope memenuhi acceptance criteria dan pemeriksaan yang diwajibkan untuk SHA itu; bukan izin merge/deploy. CHANGES_REQUESTED berarti ada cacat yang dapat diperbaiki, dan semua field temuan wajib diisi. BLOCKED berarti keputusan, akses, atau bukti penting belum tersedia; sebutkan pihak dan kondisi untuk melanjutkan. Jangan menganggap keterbatasan lingkungan sebagai bukti cacat kode tanpa reproduksi.

Severity: critical untuk bocornya secret/akses production tanpa izin; high untuk pelanggaran otorisasi atau requirement utama; medium untuk perilaku/validasi yang salah dengan dampak terbatas; low untuk masalah kecil yang tetap menghalangi acceptance criterion. Saran opsional harus ditandai non-blocking, bukan dibuat sebagai requirement baru.

## Siklus perbaikan

Executor mengakui tiap ID, mengubah branch/PR yang sama, menjalankan tes terdampak, dan mencatat SHA serta bukti baru. Reviewer memeriksa ulang temuan dan dampak perubahan. Approval lama tidak berlaku untuk diff baru; admin perlu mengaktifkan dismissal stale approvals. Maintainer memastikan required checks dan persetujuan manusia yang relevan sebelum merge. Transisi lengkap: [AGENT-WORKFLOW](AGENT-WORKFLOW.md).
