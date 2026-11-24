# Company Profile CMS

Website profil perusahaan berbasis **Laravel, MySQL, dan Filament**, dikembangkan melalui **GitHub Issues, Pull Requests, GitHub Actions, dan AI Multi-Agent Workflow**.

> **Status proyek:** Perencanaan / Milestone **M0 — GitHub Workflow Foundation**. Implementasi Laravel, CMS, dan desain antarmuka **belum dimulai**.

## 1. Sumber acuan utama

**Seluruh pengembangan wajib mengikuti [`docs/PRD.md`](docs/PRD.md).**

Aturan prioritas:
1. `docs/PRD.md` adalah sumber kebenaran kebutuhan produk (*single source of truth*).
2. `AGENTS.md` (setelah dibuat) mengatur perilaku dan batasan semua AI coding agents.
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
| Bahasa | **PHP 8.6 — target yang diminta; kompatibilitas harus diverifikasi** |
| Framework | Laravel 13 — target, tergantung verifikasi kompatibilitas |
| Database | MySQL 8.x |
| CMS admin | Filament 5 — target, tergantung verifikasi kompatibilitas |
| Frontend | Blade, Tailwind CSS, Alpine.js, Vite (tahap berikutnya) |
| Testing | Pest atau PHPUnit (ditetapkan saat perencanaan teknis) |
| Kolaborasi | GitHub Issues, Projects, Pull Requests, Actions |

Tidak boleh mengklaim PHP, framework, atau dependency sudah siap sebelum diperiksa. Jika PHP 8.6 tidak kompatibel dengan salah satu komponen, catat hambatan dan ajukan opsi kepada pemilik produk. **Jangan menurunkan versi PHP tanpa persetujuan.**

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
   EXECUTOR (model ekonomis)
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

1. Buat repository GitHub baru bernama `company-profile-cms` (disarankan **Private**).
2. Clone ke komputer dan buka menggunakan VS Code.
3. Simpan dokumen PRD resmi pada **`docs/PRD.md`** dan file ini sebagai **`README.md`** di root repository.
4. Commit dan push kedua dokumen sebelum memulai pekerjaan agent.
5. Pilih **Planner Agent** dan minta ia membaca `docs/PRD.md` terlebih dahulu.
6. Jalankan **M0 secara bertahap**: audit kebutuhan dan rencana → verifikasi pemilik → pembuatan file workflow → pemeriksaan hasil.

Contoh perintah setelah repository tersedia:

```powershell
git clone https://github.com/MuhammadZidniirfan05-dot/company-profile-cms.git
cd company-profile-cms
code .
```

Perintah di atas mengasumsikan repository menggunakan nama yang disarankan dan sudah dibuat. Jangan jalankan perintah aplikasi Laravel sebelum M0 selesai dan stack dinyatakan kompatibel.

## 7. Standar keamanan dan kontribusi

- Jangan commit `.env`, password, API token, private key, atau data rahasia.
- Jangan push langsung ke `main` setelah proteksi branch ditetapkan.
- Setiap implementasi mengacu ke Issue dan diajukan melalui PR.
- Jangan menganggap komentar `APPROVED` dari AI sebagai pengganti pemeriksaan CI dan persetujuan wajib di GitHub.
- Jangan deploy ke production tanpa persetujuan pemilik proyek dan mekanisme rollback yang jelas.
- Laporkan secara terpisah apa yang **sudah diimplementasikan**, **baru direncanakan**, atau **terblokir**.

## 8. Dokumentasi

| Dokumen | Peran |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Kebutuhan resmi dan kriteria penerimaan produk |
| `AGENTS.md` | Aturan bersama agent (dibuat di M0) |
| `docs/AGENT-WORKFLOW.md` | Mekanisme tugas, review, rework, dan persetujuan (dibuat di M0) |
| `docs/ARCHITECTURE.md` | Keputusan arsitektur (dibuat di M0) |
| `.github/` | Template Issue/PR dan workflow CI/CD (dibuat di M0) |

**Langkah berikutnya:** minta Planner memulai dengan **membaca `docs/PRD.md` dan mempresentasikan audit M0 terlebih dahulu**, bukan langsung menulis fitur website.
