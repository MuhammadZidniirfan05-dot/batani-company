## Issue dan referensi PRD

Refs #<!-- nomor Issue nyata; jangan gunakan auto-close sebelum gate release -->

Referensi: `docs/PRD.md` §... / FR-... / CMS-...

Untuk bootstrap Fase 3–4 atau integrasi Fase 4.5 yang belum memiliki Issue: hapus baris Refs, catat instruksi langsung owner beserta batas otorisasinya, dan nyatakan bahwa Issue belum dibuat. Jangan mengarang nomor, review, atau persetujuan.

## Ringkasan implementasi

Masalah, hasil perubahan, dan scope yang diselesaikan:

## Berkas yang berubah

Daftar berkas dan tujuan perubahan:

Alur input → use case → persistence/layanan luar; tanggung jawab dan batas komponen yang berubah; alasan abstraksi/dependency baru (N/A beralasan untuk dokumentasi murni). Acuan: [Clean Architecture dan Clean Code](../docs/ARCHITECTURE.md#clean-architecture-dan-clean-code).

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

- Planner — ID sesi, run/turn atau waktu, model/reasoning aktual, sumber bukti:
- Executor — ID sesi, run/turn atau waktu, model/reasoning aktual, sumber bukti:
- Reviewer — ID sesi berbeda, run/turn atau waktu, model/reasoning aktual, sumber bukti: pending bila belum ditugaskan.
- Dasar pemilihan tingkat reasoning dan kelas biaya Reviewer:
- Head/base SHA yang direview:
- Bukti CI untuk head tersebut:
- Laporan Reviewer dan keputusan: pending / APPROVED / CHANGES_REQUESTED / BLOCKED.
- Bukti status `Agent review`: belum diterbitkan atau tautan aktual.
- Prompt koreksi Executor bila CHANGES_REQUESTED:

Satu akun GitHub diperbolehkan. Planner/Worker boleh satu chat dengan handoff peran/model; Reviewer memakai chat lain. Prompt/target bukan bukti model telah berganti; tulis belum terverifikasi bila metadata tidak tersedia, dan pisahkan konfirmasi owner dari metadata runtime. Laporan agent bukan approval native GitHub. Koreksi dan review ulang dilakukan pada PR ini; perubahan head/base memerlukan hasil terbaru. Acuan: PRD §§9.1, 9.4, 9.5, 11, 13 v1.6.

- [ ] Referensi PRD dan scope sesuai Issue/otorisasi bootstrap.
- [ ] Acceptance criteria dipetakan ke bukti aktual pada SHA terbaru.
- [ ] Required checks lulus di GitHub; hasil lokal diberi label lokal.
- [ ] Keamanan, dampak data, dan regresi telah ditinjau.
- [ ] Batas arsitektur, arah dependensi, clean code dan tes perilaku/jalur gagal telah diperiksa sesuai scope; tidak ada abstraksi tanpa kebutuhan.
- [ ] Seluruh temuan blocking diselesaikan dan dokumentasi diperbarui.
- [ ] Verdict memakai APPROVED / CHANGES_REQUESTED / BLOCKED sesuai `docs/REVIEW-CHECKLIST.md`.
- [ ] Approval AI tidak diperlakukan sebagai izin merge atau production deploy.
