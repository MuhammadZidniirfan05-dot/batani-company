# Company Profile CMS

Website profil perusahaan berbasis **Laravel, MySQL, dan Filament**, dikembangkan melalui **GitHub Issues, Pull Requests, GitHub Actions, dan AI Multi-Agent Workflow**.

> **Status proyek:** Fondasi Laravel 13 mulai dibangun pada [Issue #8](https://github.com/MuhammadZidniirfan05-dot/batani-company/issues/8) atas instruksi owner (PRD v1.7). Modul CMS dan desain final belum dibuat. Penerimaan formal M0 serta kontrol merge/release tetap terpisah.

Untuk menjalankan fondasi sekarang, ikuti [panduan lokal](docs/LOCAL-DEVELOPMENT.md). Gunakan PHP **8.5.12**; tersedia task VS Code untuk build aset dan server lokal. Aturan penundaan M0 pada bagian historis di bawah telah dikecualikan untuk scope Issue #8; Worker tugas ini memakai target agent mahal, bukan Worker murah default.

## 1. Sumber acuan utama

**Seluruh pengembangan wajib mengikuti [`docs/PRD.md`](docs/PRD.md).**

Aturan prioritas:
1. `docs/PRD.md` adalah sumber kebenaran kebutuhan produk (*single source of truth*).
2. [`AGENTS.md`](AGENTS.md) mengatur perilaku dan batasan semua AI coding agents.
3. GitHub Issue menentukan ruang lingkup tugas yang disetujui berdasarkan PRD.
4. Pull Request memuat implementasi dan bukti pengujian tugas tersebut.
5. Jika Issue atau instruksi agent bertentangan dengan PRD, hentikan pekerjaan yang terdampak dan minta keputusan pemilik produk; **jangan mengubah PRD diam-diam**.

## 2. Ruang lingkup produk

Navigasi website yang disepakati:

- **Tentang Kami**
- **Layanan** (dropdown)
  - Visi/Misi
  - Direktur Eksekutif
  - Tim Ahli
  - Struktur Organisasi
  - Tujuan Perusahaan
  - Nilai Perusahaan
  - Pencapaian
- **Publikasi** (dropdown, tepat tiga submenu)
  - Berita
  - **Publikasi dan Kajian** (satu submenu gabungan)
  - **Project IT**
- **Kontak**
- **Search** di navbar

Konten akan dikelola melalui CMS Filament sesuai hak akses. Arah desain adalah **modern minimalis**, tetapi pengerjaan desain **ditunda** sampai workflow pengembangan siap.

## 3. Stack teknologi (rencana)

| Komponen | Teknologi / status |
|---|---|
| Bahasa | **PHP 8.5.12 — target yang disetujui; kompatibilitas harus diverifikasi** |
| Framework | Laravel 13 — target, tergantung verifikasi kompatibilitas |
| Database | MySQL 8.x |
| CMS admin | Filament 5 — target, tergantung verifikasi kompatibilitas |
| Frontend | Laravel Blade untuk tampilan publik, Tailwind CSS, Alpine.js, Vite; implementasi setelah workflow berjalan dan M0 diterima |
| Testing | Pest atau PHPUnit (ditetapkan saat perencanaan teknis) |
| Kolaborasi | GitHub Issues, Projects, Pull Requests, Actions |

Target PHP **8.5.12** menggantikan 8.6 sesuai keputusan eksplisit owner pada 2026-11-24 ([PRD §13](docs/PRD.md#13-change-control-and-precedence)). Ini target resmi, bukan workaround sementara. Tidak boleh mengklaim PHP, framework, atau dependency sudah siap sebelum diperiksa. Jika PHP 8.5.12 tidak kompatibel dengan salah satu komponen, catat hambatan dan ajukan opsi kepada pemilik produk. **Jangan mengubah versi PHP tanpa persetujuan.**

## 4. Workflow pengembangan multi-agent

```text
Pemilik Produk + docs/PRD.md
             |
             v
   PLANNER (model reasoning tinggi)
             |
    GitHub Issue yang terukur
             |
             v
   EXECUTOR (model sesuai tahap)
             |
   Feature branch + Pull Request
             |
     GitHub Actions / CI checks
             |
             v
   REVIEWER (model reasoning tinggi)
        /                 \
CHANGES_REQUESTED      APPROVED
        |                 |
Kembali ke Executor     Merge sesuai proteksi branch
                          |
                    Uji di staging
                          |
                 Persetujuan manusia
                          |
                    Production deploy
```

- **Planner:** membaca PRD, membuat rancangan dan Issue dengan acceptance criteria.
- **Executor:** membaca PRD, `AGENTS.md`, dan Issue; mengubah kode dalam branch terpisah; menambahkan pengujian; membuat PR.
- **Reviewer:** memverifikasi perubahan terhadap PRD, Issue, tes, dan keamanan; memberikan persetujuan atau instruksi perbaikan yang dapat dieksekusi.
- **Pemilik Produk:** menyetujui perubahan penting dan **wajib menyetujui deployment produksi**.

> Keterangan: Diagram di atas adalah **workflow target**, bukan klaim bahwa agent GitHub atau deployment otomatis sudah terpasang.

Satu akun GitHub diperbolehkan. Planner dan Worker boleh melanjutkan dalam chat yang sama dengan handoff peran/model; Reviewer memakai chat lain untuk review independen. CI dan review terbaru yang lulus menjadi syarat kelayakan merge; penolakan harus disertai alasan dan prompt koreksi untuk Worker pada PR yang sama. Approval native dari akun GitHub kedua tidak diwajibkan. Acuan: [PRD](docs/PRD.md) §§9, 11, 13 v1.6.

Model/peran mengikuti tahap: seluruh fondasi workflow memakai `gpt-6-astra/high`, termasuk coding tooling; saat aplikasi dimulai Worker memakai `gpt-6.1-sol/medium`, sedangkan Planner/Reviewer tetap `gpt-6-astra/high`. Catat model/reasoning aktual per tahap; pilihan target atau teks prompt tidak membuktikan pergantian model. Owner telah mengizinkan penyelesaian workflow lokal dan GitHub pada PRD §13 v1.5; izin bukan bukti gate aktif. Kabari owner sebelum coding aplikasi Laravel/Filament/Blade dimulai.

Alur harian setelah aplikasi diizinkan:

1. **Planner mahal:** susun dan publikasikan Issue terukur; owner/maintainer menetapkan READY sesuai otorisasi.
2. **Chat yang sama:** Planner menyerahkan URL Issue dan meminta pemilihan Worker `gpt-6.1-sol/medium`. Owner memilihnya melalui pemilih model, lalu mengirim prompt Worker.
3. **Worker murah:** baca Issue, PRD dan aturan proyek; periksa Git; implementasikan scope, jalankan tes dan ajukan PR beserta bukti.
4. **Reviewer mahal di chat lain:** periksa Issue, diff, Clean Architecture/Clean Code, tes dan CI. Bila ditolak, kembalikan prompt koreksi ke Worker untuk Issue/PR yang sama.

Prompt siap salin dan pencatatan metadata ada di [runbook](docs/AGENT-WORKFLOW.md#handoff-satu-chat-dan-prompt). Aturan kualitas konkret ada di [arsitektur](docs/ARCHITECTURE.md#clean-architecture-dan-clean-code); nama folder saja tidak membuktikan arsitektur bersih.

## 5. Milestone awal: M0 — GitHub Workflow Foundation

M0 diprioritaskan sebelum implementasi fitur website. Ruang lingkupnya mencakup:

- Validasi PRD dan kompatibilitas stack.
- `AGENTS.md` serta dokumentasi arsitektur dan alur agent.
- GitHub Issue Forms dan Pull Request Template.
- Rencana branching, label, Projects, proteksi branch, dan review gate.
- GitHub Actions untuk pemeriksaan yang memang bisa dijalankan pada tahap ini.
- Desain mekanisme deployment staging dan production yang aman.
- Backlog Issue untuk milestone pengembangan berikutnya.

**Belum termasuk M0:** scaffolding aplikasi Laravel, tabel produksi, resource Filament, homepage, halaman publik, dan implementasi visual.

## 6. Cara memulai di VS Code

1. Gunakan repository resmi **Public** [`MuhammadZidniirfan05-dot/batani-company`](https://github.com/MuhammadZidniirfan05-dot/batani-company), sesuai keputusan owner 24 November 2026 dan penegasan visibilitas Public pada 25 November 2026.
2. Untuk workspace yang sudah tersedia, buka folder `D:/laragon/www/batani-company` di VS Code tanpa clone ulang.
3. Baca seluruh [`docs/PRD.md`](docs/PRD.md), [`AGENTS.md`](AGENTS.md), dan [`docs/AGENT-WORKFLOW.md`](docs/AGENT-WORKFLOW.md). Periksa status Git dan perubahan lokal sebelum bekerja; pertahankan pekerjaan yang sudah ada.
4. Gunakan branch dari Issue READY dan baseline yang disepakati. Jalankan validasi lokal, lengkapi bukti serta deskripsi PR, lalu publikasikan dalam scope izin workflow PRD §13 v1.5. PR fondasi tetap menjadi dependensi sampai gate dan penerimaannya lengkap.
5. Catat handoff Planner → Worker dalam chat yang sama dan gunakan chat lain untuk Reviewer. Penerimaan M0 memerlukan pemeriksaan CI dan review sesuai [`docs/PRD.md`](docs/PRD.md) §§9, 11, dan 13, termasuk verifikasi kontrol GitHub yang benar-benar aktif sebelum merge.
6. Issue workflow lanjutan kini diizinkan. Tahap ini tidak mencakup scaffolding aplikasi, deployment, maupun Fase 5; kabari owner saat siap berpindah ke coding aplikasi.

Untuk membuka workspace yang sudah ada:

```powershell
Set-Location D:/laragon/www/batani-company
code .
```

Clone hanya diperlukan jika membuat checkout baru, dari direktori induk yang belum memiliki folder tujuan:

```powershell
git clone https://github.com/MuhammadZidniirfan05-dot/batani-company.git
Set-Location batani-company
code .
```

Owner mengizinkan menjalankan fondasi Laravel lokal dalam scope Issue #8. Periksa runtime, dependency dan hasil tes aktual; jangan menyamakan fondasi ini dengan kompatibilitas CMS/hosting atau kesiapan produksi.

## 7. Standar keamanan dan kontribusi

- Jangan commit `.env`, password, API token, private key, atau data rahasia.
- Jangan push langsung ke `main` setelah proteksi branch ditetapkan.
- Setiap implementasi mengacu ke Issue dan diajukan melalui PR.
- Terapkan [Clean Architecture dan Clean Code](docs/ARCHITECTURE.md#clean-architecture-dan-clean-code): batas bisnis/UI/I/O jelas, kode fokus dan mudah dibaca, serta tes perilaku dan jalur gagal sesuai risiko.
- Jangan menganggap komentar `APPROVED` dari AI sebagai pengganti pemeriksaan CI dan persetujuan wajib di GitHub.
- Jangan deploy ke production tanpa persetujuan pemilik proyek dan mekanisme rollback yang jelas.
- Laporkan secara terpisah apa yang **sudah diimplementasikan**, **baru direncanakan**, atau **terblokir**.

## 8. Dokumentasi

| Dokumen | Peran |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Kebutuhan resmi dan kriteria penerimaan produk |
| [`AGENTS.md`](AGENTS.md) | Aturan bersama agent |
| [`docs/AGENT-WORKFLOW.md`](docs/AGENT-WORKFLOW.md) | Mekanisme tugas, review, rework, persetujuan, dan rencana publikasi M0 |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Keputusan arsitektur |
| [`.github/`](.github/) | Template Issue/PR dan workflow validasi M0 |

**Langkah berikutnya:** verifikasi fondasi Laravel Issue #8, lalu rencanakan koneksi MySQL dan CMS Filament sebagai scope berikutnya. Review terpisah, isolasi dan kontrol merge tetap mengikuti [`docs/PRD.md`](docs/PRD.md) §§9, 11, 13; fondasi aplikasi bukan website/CMS yang selesai.
