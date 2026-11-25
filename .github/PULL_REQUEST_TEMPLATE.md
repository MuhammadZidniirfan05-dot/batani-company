## Issue dan referensi PRD

Refs #<!-- nomor Issue nyata; jangan gunakan auto-close sebelum gate release -->

Referensi: `docs/PRD.md` §... / FR-... / CMS-...

Untuk bootstrap Fase 3–4 atau integrasi Fase 4.5 yang belum memiliki Issue: hapus baris Refs, catat instruksi langsung owner beserta batas otorisasinya, dan nyatakan bahwa Issue belum dibuat. Jangan mengarang nomor, review, atau persetujuan.

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

Handoff dan hasil review agent:

- Planner — ID agent/sesi, model:
- Executor — ID agent/sesi, model:
- Reviewer — ID agent/sesi, model/reasoning: pending bila belum ditugaskan.
- Dasar pemilihan tingkat reasoning dan kelas biaya Reviewer:
- Head/base SHA yang direview:
- Bukti CI untuk head tersebut:
- Laporan Reviewer dan keputusan: pending / APPROVED / CHANGES_REQUESTED / BLOCKED.
- Bukti status `Agent review`: belum diterbitkan atau tautan aktual.
- Prompt koreksi Executor bila CHANGES_REQUESTED:

Satu akun GitHub diperbolehkan; agent/sesi tiap peran tetap wajib berbeda. Jangan mengisi bukti yang belum ada. Laporan agent bukan approval native GitHub. Koreksi dan review ulang dilakukan pada PR ini; perubahan head/base memerlukan hasil terbaru. Acuan: PRD §§9.4, 9.5, 11, 13.

- [ ] Referensi PRD dan scope sesuai Issue/otorisasi bootstrap.
- [ ] Acceptance criteria dipetakan ke bukti aktual pada SHA terbaru.
- [ ] Required checks lulus di GitHub; hasil lokal diberi label lokal.
- [ ] Keamanan, dampak data, dan regresi telah ditinjau.
- [ ] Seluruh temuan blocking diselesaikan dan dokumentasi diperbarui.
- [ ] Verdict memakai APPROVED / CHANGES_REQUESTED / BLOCKED sesuai `docs/REVIEW-CHECKLIST.md`.
- [ ] Approval AI tidak diperlakukan sebagai izin merge atau production deploy.
