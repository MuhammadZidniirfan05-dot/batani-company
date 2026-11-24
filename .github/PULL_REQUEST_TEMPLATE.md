## Issue dan referensi PRD

Refs #<!-- nomor Issue nyata; jangan gunakan auto-close sebelum gate release -->

Referensi: `docs/PRD.md` §... / FR-... / CMS-...

Untuk bootstrap Fase 3–4 yang belum memiliki Issue: hapus baris Refs, catat instruksi langsung owner, dan nyatakan bahwa Issue belum dibuat. Jangan mengarang nomor, review, atau persetujuan.

## Ringkasan implementasi

Masalah, hasil perubahan, dan scope yang diselesaikan:

## Berkas yang berubah

Daftar berkas dan tujuan perubahan:

## Acceptance criteria dan bukti

| Kriteria dari Issue | Bukti pada commit terbaru | Status |
|---|---|---|
| Isi sebelum meminta review | Perintah/output atau URL yang nyata | Pending |

## Pengujian aktual

Commit SHA yang diperiksa:
Lingkungan/versi:

| Perintah / skenario yang benar-benar dijalankan | Exit code / hasil | Output atau URL run |
|---|---|---|
| Isi dengan bukti aktual | Pending | Pending |

Pemeriksaan yang tidak dijalankan dan alasannya:
Pada M0, jangan mengklaim tes Laravel atau build frontend berjalan.

## Dampak data dan migrasi

Jelaskan dampak dan rollback; N/A wajib disertai alasan. M0 tidak membuat migrasi aplikasi.

## Keamanan

Jelaskan perubahan izin, secret handling, dependency dan risiko relevan; pastikan bukti sudah diredaksi.

## Keterbatasan dan keputusan owner

Blocker, keputusan yang masih menunggu, pekerjaan manual, dan referensi persetujuan nyata bila diperlukan:

## Respons atas review sebelumnya

ID temuan → perbaikan → SHA → verifikasi. Gunakan PR yang sama untuk rework; N/A bila review pertama.

## Checklist reviewer

- [ ] Referensi PRD dan scope sesuai Issue/otorisasi bootstrap.
- [ ] Acceptance criteria dipetakan ke bukti aktual pada SHA terbaru.
- [ ] Required checks lulus di GitHub; hasil lokal diberi label lokal.
- [ ] Keamanan, dampak data, dan regresi telah ditinjau.
- [ ] Seluruh temuan blocking diselesaikan dan dokumentasi diperbarui.
- [ ] Verdict memakai APPROVED / CHANGES_REQUESTED / BLOCKED sesuai `docs/REVIEW-CHECKLIST.md`.
- [ ] Approval AI tidak diperlakukan sebagai izin merge atau production deploy.
