# Simulator offline Agent review — F1, Issue #4

Modul ini menyiapkan evaluasi kebijakan dan lifecycle sintetis berdasarkan
[PRD](../../docs/PRD.md) §§9.1, 9.4, 9.5, dan 11. Modul tidak mengakses GitHub,
menerbitkan status, memverifikasi tanda tangan kriptografis, menjalankan
deployment, atau mengaktifkan gate native. Semua hasil memuat
`simulationOnly: true` dan `nativeGateVerified: false`.

## Kontrak

`evaluateReview(request, context)` menerima dua argumen terpisah. `context`
merepresentasikan snapshot operator **sintetis**, termasuk registry sesi,
sumber CI yang diharapkan, CI terbaru, provenance, waktu, dan jurnal replay.
Evaluator tidak membangun context dari klaim request. Semua data fixture,
identitas, receipt, metadata, dan evidence merupakan contoh sintetis.

Hasil lokal adalah `READY_TO_PUBLISH`, `HOLD`, atau `ALREADY_PROCESSED`.
`READY_TO_PUBLISH` hanya menghasilkan rencana sintetis, bukan izin publikasi.
Field `signatureReceipt` hanya dicocokkan terhadap context; tidak ada
verifikasi signature, trust root, publisher, atau attestation eksternal.

`context.reviewPolicy.maxAgeSeconds` adalah integer positif yang membatasi
interval `issuedAt` sampai `expiresAt`. Nilai `3600` dalam fixture merupakan
parameter sintetis, bukan SLA produksi atau keputusan kebutuhan owner.

`replayUpdate` adalah usulan checkpoint untuk envelope baru, termasuk hasil
penolakan. Harness berikutnya harus menyimpan checkpoint dan membatalkan
rencana lama secara atomik; F1 tidak menyediakan penyimpanan, concurrency
control, atau publisher. Duplikasi tidak menghasilkan rencana baru.
Urutan monoton melindungi penolakan terbaru dari review berurutan lebih lama.

Checkpoint menyimpan `latestReview`, salinan lengkap request terbaru yang
sudah diproses, termasuk penolakan; nilai awal `null`. Gunakan checkpoint
keluaran evaluator sebagai context berikutnya, bukan klaim request yang belum
diperiksa. Batas ukuran dan schema berlaku pada seluruh context.

Lifecycle dapat memakai ulang evidence consumed melalui helper privat bila
seluruh request identik dengan `latestReview`, sequence paling baru, dan ID
serta nonce tercatat consumed. Assignment/epoch, provenance, registry, waktu,
target, PR dan gate CI diperiksa kembali. Reuse tidak membuat publikasi atau
checkpoint baru; evaluator publik tetap `ALREADY_PROCESSED` pada duplikasi.
Penolakan terbaru mengganti record dan mencegah reuse approval lama. Record
tetap evidence sintetis, bukan attestation atau ledger persisten.

Input harus berupa pohon data JSON. `parseSimulationJSON` membatasi input
64 KiB dan menolak struktur berlebihan, prototype keys, dan tipe yang tidak
didukung. Evaluator juga memvalidasi schema nested, unknown fields, ukuran,
tipe, descriptor accessor, fingerprint snapshot/CI, metadata peran, expiry,
dan replay. Teks findings diperlakukan sebagai data; tidak dievaluasi.

`transitionLifecycle(state, command, context)` hanya menghitung transisi
sintetis. Evidence refs `syn:` bukan bukti GitHub atau deployment nyata.
Rework mempertahankan repo/PR. Perubahan snapshot membatalkan kelayakan
approval lama; transisi kembali ke `IN_REVIEW` memerlukan CI baru.
`BLOCKED` menyimpan origin dan memerlukan evidence pemulihan oleh owner.
Pemulihan ke `IN_REVIEW`, `APPROVED`, atau `CHANGES_REQUESTED` memerlukan PR
terbuka, unik, bukan draft, dan mergeable. State setelah merge tidak
mensyaratkan PR tetap terbuka.
Transisi `APPROVED → MERGED` hanya mengizinkan actor `owner`; kewenangan
publisher status tidak memberikan kewenangan merge.
Shortcut `MERGED → DONE` dinonaktifkan secara default dan membutuhkan
`allowDocsOnlyDone: true` serta `pureDocs: true`, keduanya dalam simulasi.

## Verifikasi lokal

Dari root repository, menggunakan Node 24:

```text
node --permission --allow-fs-read=tools/agent-review tools/agent-review/test/policy.test.mjs
```

Tidak ada dependency pihak ketiga. Operator harus mencatat runtime, commit,
perintah aktual, exit code, dan hasil run. Berkas ini tidak mengklaim tes
sudah dijalankan atau bahwa GitHub Actions telah lulus.

| Cakupan | Tes lokal |
| --- | --- |
| Approval sintetis, CI gagal/hilang/pending | F1-01–F1-03 |
| Snapshot, scope, sumber CI, sesi/model/provenance, batas lifetime dari policy | F1-04–F1-07, F1-20 |
| Replay, penolakan terbaru, CI attempt, status PR | F1-08–F1-10 |
| Schema, batas input, accessor, teks inert, penolakan real mode | F1-11–F1-12 |
| Aktor/evidence seluruh edge, correction loop, larangan publisher melakukan merge | F1-13–F1-14, F1-21 |
| BLOCKED, snapshot/CI usang, identitas PR | F1-15–F1-17 |
| Shortcut docs-only dan transisi terlarang | F1-18–F1-19 |
| Komposisi checkpoint, reuse evidence dan invalidasi oleh penolakan terbaru | F1-22–F1-24 |
| Kelayakan PR saat recovery dan recovery setelah merge | F1-25–F1-26 |

## Keterkaitan acceptance matrix T01–T24

Sumber: [matrix workflow](../../docs/M0-D-M0-F-PLAN.md).
`Covered (lokal)` berarti cabang simulator memiliki tes, bukan acceptance
GitHub nyata telah terpenuhi. `Subset` berarti hanya sebagian dimodelkan;
`Pending` berarti kontrol utamanya belum diimplementasikan atau dibuktikan.
ID `F1-*` adalah tes lokal, berbeda dari ID `T*`. Hasil run dicatat terpisah.

| Matrix | Status F1 | Tes lokal dan batas bukti |
| --- | --- | --- |
| T01 APPROVED asli + CI sukses | Subset | F1-01: approval/provenance sintetis; keaslian review belum dibuktikan. |
| T02 CI gagal | Covered (lokal) | F1-02 menahan approval untuk CI gagal sintetis. |
| T03 CI hilang/pending/cancelled/skipped/neutral | Covered (lokal) | F1-02 menahan kondisi tersebut. |
| T04 CHANGES_REQUESTED | Covered (lokal) | F1-03, F1-13–F1-14: detail koreksi dan correction loop sintetis. |
| T05 BLOCKED atau review hilang | Covered (lokal) | F1-02–F1-03: review null/BLOCKED tidak menghasilkan rencana sukses. |
| T06 head berubah | Covered (lokal) | F1-04, F1-16: snapshot berbeda ditolak; approval lama tidak dapat merge. |
| T07 base berubah saat head sama, termasuk ancestor | Subset | F1-04 membandingkan base SHA; ancestry/gate native belum diuji. |
| T08 race head/base/merge antara baca dan tulis | Pending | F1-04/F1-16 hanya membandingkan snapshot; belum ada write atau operasi atomik. |
| T09 event terlewat/publisher mati/native tetap tertutup | Pending | Publisher dan gate native belum tersedia. |
| T10 Agent review palsu/sumber salah | Pending | F1-05 memeriksa sumber CI, bukan penerbit status Agent review. |
| T11 signature/issuer/audience/model/sesi palsu | Subset | F1-06–F1-07 mencocokkan registry/receipt sintetis; signature, audience dan attestation nyata belum diverifikasi. |
| T12 expiry/epoch/reuse saat rework | Subset | F1-04, F1-07–F1-08, F1-14, F1-20, F1-22–F1-23: expiry/epoch/replay/rework dan reuse lokal; kontrol persisten belum tersedia. |
| T13 duplicate idempotent | Subset | F1-08, F1-22: duplikasi tanpa rencana baru, lifecycle memakai evidence exact; ledger atomik/publikasi belum tersedia. |
| T14 approval lama setelah penolakan baru | Subset | F1-08, F1-24: checkpoint penolakan terbaru mencegah reuse approval lama; publisher nyata belum diuji. |
| T15 CI attempt terbaru | Covered (lokal) | F1-09 mencocokkan run/attempt dengan snapshot terbaru sintetis. |
| T16 nama check sama, workflow/digest/App/event salah | Subset | F1-05 memeriksa fingerprint CI; check bernama sama/integrasi nyata belum diuji. |
| T17 validator/CI berubah dan payload inert | Subset | F1-04–F1-05 memeriksa digest; F1-12 memperlakukan teks sebagai data. Trust validator/isolasi eksekusi nyata belum dibuktikan. |
| T18 dua PR/target/repo/base ref berubah | Subset | F1-04, F1-10, F1-17 memeriksa repo/PR/flag ambigu; enumerasi PR/base ref belum dimodelkan. |
| T19 API 401/403/429/5xx/timeout/pagination/merge unknown | Subset | F1-10 menolak mergeability unknown; API/retry/timeout/pagination belum diimplementasikan. |
| T20 revoke gagal/restart ledger | Pending | Belum ada revoke/publisher/ledger persisten. |
| T21 isolasi Worker nyata/canary | Pending | Permission canary proses tes tidak memenuhi isolasi seluruh agent/kredensial. |
| T22 draft/closed/conflict/policy atau contract berubah | Covered (lokal) | F1-04, F1-10, F1-23, F1-25 memeriksa status PR/digest, reuse dan recovery review sintetis. |
| T23 findings belum selesai/AC/metadata unknown | Subset | F1-03/F1-06 memeriksa kelengkapan, AC/metadata; pelacakan resolusi nyata belum tersedia. |
| T24 malformed/unknown/oversize/injection | Covered (lokal) | F1-11–F1-12 memeriksa schema/ukuran/accessor/teks inert; bukan sandbox kode berbahaya. |

## Batas dan gate yang belum selesai

T09, T20, dan T21 pada acceptance matrix workflow nyata tetap **belum lengkap**.
Tes F1 tidak membuktikan isolasi agent/kredensial, identitas model aktual,
otoritas publisher, penerapan branch protection, gate native, ataupun loop
GitHub nyata. Fixture tidak membuktikan sesi Planner/Worker/Reviewer nyata
telah terpisah. Field metadata hanya memodelkan pemeriksaan registry.

Permission model Node adalah pembatas tambahan untuk kode tepercaya, bukan
sandbox keamanan bagi kode berbahaya. Canary permission, bila dijalankan
operator, hanya membuktikan batas baca/tulis filesystem dan subprocess yang
benar-benar dites. Jangan menyimpulkan penolakan network, isolasi kredensial,
atau penahanan malicious code dari flag tersebut. Lihat
[dokumentasi permission Node](https://nodejs.org/api/permissions.html).

F2 memerlukan adapter mock dan penyimpanan/invalidation yang teruji.
F3 memerlukan trust, pemisahan izin, publisher, serta pengujian gate native
nyata. F4 memerlukan loop end-to-end nyata. Belum ada izin aplikasi atau Fase 5.
