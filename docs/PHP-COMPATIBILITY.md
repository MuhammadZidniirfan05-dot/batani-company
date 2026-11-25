# Gate kompatibilitas PHP dan stack

**Bukti Issue #10, 2026-11-25:** [Laravel CI pada PR #11](https://github.com/MuhammadZidniirfan05-dot/batani-company/actions/runs/45644483861) menjalankan PHP 8.5.12 dan suite integrasi pada service resmi MySQL 8.4.7 (image digest `sha256:0426ec38c7a10aa45ba383887df7878f74ee70e2fd589c7b69207f3577901903`). Tiga tes/13 assertion lulus: verifikasi versi/schema MySQL, migration dan rerun, Eloquent CRUD/Unicode/unique constraint, serta rollback transaksi. Suite default 14 tes/28 assertion tetap lulus. Ini membuktikan kombinasi PHP CLI/container, Laravel dan MySQL service CI untuk scope tes tersebut; MySQL Laragon, PHP Apache, Filament, hosting, dan penerimaan keseluruhan gate masih belum terverifikasi. Detail perintah dan pembatasan database ada pada [panduan lokal](LOCAL-DEVELOPMENT.md).

**Pembaruan v1.7, 2026-11-25:** owner mengizinkan membangun dan menguji fondasi Laravel pada [Issue #8](https://github.com/MuhammadZidniirfan05-dot/batani-company/issues/8) sekarang. Runtime CLI 8.5.12 dan Composer 2.10.2 kembali diperiksa langsung. Bukti dependency, tes, build dan CI dicatat pada PR Issue #8 setelah dijalankan. Syarat lama menunda seluruh scaffolding di bawah adalah riwayat; batas aktif sesuai [PRD](PRD.md) §13 v1.7. Filament, koneksi MySQL nyata, Apache dan hosting tetap memerlukan pengujian tersendiri; jangan menganggap seluruh gate kompatibilitas lulus.

Acuan: [PRD](PRD.md) §§3, 8, 9.6, 10–13. Status gate kompatibilitas: **BELUM LULUS**. Target resmi sekarang **PHP 8.5.12**, menggantikan 8.6 atas instruksi eksplisit owner pada 2026-11-24 yang dicatat di PRD §13. Laravel **13**, Filament **5**, MySQL **8.x**, Blade/Tailwind/Alpine/Vite tetap rencana. Keputusan ini mengubah target teknologi, bukan workaround sementara atau izin scaffolding/Fase 5.

## Bukti untuk target 8.5.12, 2026-11-24

| Komponen | Bukti aktual | Batas bukti / tindak lanjut |
|---|---|---|
| PHP 8.5.12 | [Pengumuman resmi](https://www.php.net/releases/8_5_12.php) tersedia. Binary Laragon 8.5.12 dipanggil langsung dan melaporkan versi 8.5.12, ZTS, Visual C++ 2022 x64 | Ketersediaan dan CLI lokal terverifikasi; PHP web belum diuji melalui HTTP |
| Laravel 13 | [Support policy](https://laravel.com/framework/docs/13.x/releases) mencantumkan PHP 8.3–8.5 | Seri 8.5 termasuk dukungan resmi; tetap perlu tag/lock dan tes proyek pada patch 8.5.12 |
| Filament 5 | [Metadata tag 5.12.0](https://github.com/filamentphp/filament/blob/v5.12.0/packages/support/composer.json) memuat PHP `^8.2`, Laravel `^11.28\|^12.0\|^13.0`, `ext-intl`, dan Livewire `^4.4.9` | Constraint PHP menerima 8.5.12 dan Laravel 13; dependency graph aplikasi lengkap belum di-resolve/diuji |
| Composer | Composer 2.10.2 berhasil menjalankan `--no-plugins --version` melalui binary PHP 8.5.12; exit 0 | Ini hanya pemeriksaan CLI; belum ada manifest/lock aplikasi, install, audit, atau platform check dependency aplikasi |
| Extension / MySQL | `php.exe -m` pada 8.5.12 memuat `pdo_mysql`, `intl`, `mbstring`, `openssl`, `curl`, `fileinfo`, `dom`, `xml`, `gd`, dan `zip`; exit 0 | Driver tersedia; koneksi, transaksi, TLS/auth, dan perilaku MySQL belum diuji |
| CI dan hosting | CI proyek saat ini hanya validasi M0 dengan Node; provider belum dipilih | Buktikan runtime 8.5.12 dan extension pada runner/host yang dipilih; jangan menyamakan dukungan seri 8.5 dengan tersedianya patch persis 8.5.12 |

Kesimpulan terbatas: hambatan dukungan Laravel yang dicatat untuk target lama 8.6 tidak berlaku pada rentang dukungan 8.5. Namun dukungan vendor, constraint paket, dan CLI yang bisa berjalan belum membuktikan seluruh stack aplikasi lulus. MySQL, test runner, frontend build, CI PHP, dan hosting tetap memerlukan validasi sesuai PRD §§3, 8, 11–12.

## Bukti historis untuk target lama 8.6

Pisahkan ketersediaan rilis, constraint paket, dukungan vendor, konfigurasi tes upstream, hasil tes aktual, dan kemampuan host. Constraint Composer yang menerima versi lebih baru tidak membuktikan perilaku runtime. Workflow upstream bukan bukti run sukses milik proyek.

Tabel berikut mempertahankan sumber yang diperiksa pada audit Fase 1–2 tanggal 2026-11-24, sebelum keputusan perubahan versi. Kolom tindak lanjut merekam rencana saat target masih 8.6; target dan langkah aktif mengikuti bagian 8.5.12 serta kriteria gate di bawah. Pemeriksaan Fase 3–4 tidak menjalankan matriks aplikasi.

| Komponen | Bukti / risiko | Tindak lanjut sesuai PRD §3 |
|---|---|---|
| PHP 8.6 | Rilis resmi 19 November 2026; Windows binary tersedia. Belum ditemukan instalasi 8.6 lokal pada audit | Sediakan runtime uji 8.6 dan extension yang benar; jangan memakai 8.5 sebagai bukti kelulusan |
| Laravel 13 | Tabel dukungan menyebut 8.3–8.5. Release 13.43.0 menerima `^8.3`, tetapi matrix tag berhenti di 8.5; branch 13.x menambah 8.6 | Pilih tag stabil yang tepat, rekonsiliasi bukti dukungan, uji tanpa memaksa platform |
| Filament 5 | Tag 5.12.0 menerima Laravel 13, PHP `^8.2`, `intl`, Livewire `^4.4.9`. Matrix PHP 8.6 ada, tetapi dependency test menggunakan bypass batas atas PHP; kombinasi itu memakai SQLite | Jangan menyimpulkan kombinasi PHP 8.6/MySQL lulus. Resolve dan uji dependency aplikasi yang sebenarnya |
| Test runner | Workflow upstream Filament menyebut ParaTest yang cocok dengan Pest 4 membatasi PHP sampai 8.5; dependency dev upstream tidak otomatis dipasang oleh aplikasi pemakai Filament | Evaluasi versi Pest/ParaTest yang sesuai atau PHPUnit; pilihan belum disetujui dan harus diuji |
| Composer | Lokal 2.10.2 berjalan pada PHP 8.5.10. Release 2.11.1 mencatat perbaikan deprecation PHP 8.6 pada ca-bundle | Gunakan stable Composer yang memuat perbaikan untuk eksperimen target; belum di-upgrade |
| MySQL | Laravel mencantumkan dukungan MySQL 5.7+. MySQL 8.0 EOL April 2026; 8.4 LTS kandidat dalam target 8.x | Pilih patch 8.4 terpelihara, verifikasi PDO/TLS/auth/collation dan integrasi database |
| Frontend | Skeleton Laravel 13 memakai Vite 8/plugin 3/Tailwind 4; Filament membutuhkan Tailwind 4.1+. Node lokal 24.14.1 memenuhi engine plugin yang diperiksa | Kunci package dan build nyata nanti; hindari Alpine ganda pada halaman Livewire |
| CI | setup-php mendokumentasikan seri 8.6 stable; belum ada run PHP proyek | Tambah job runtime/MySQL setelah ruang eksperimen diterima; tidak menambahkan tes aplikasi fiktif ke CI M0 |
| Hosting | Provider belum dipilih. Dokumentasi Laravel Cloud saat audit hanya menawarkan PHP 8.2–8.5 | Verifikasi provider dengan PHP 8.6 dan extension; jangan menganggap host Laravel otomatis mendukung target |

## Sumber primer audit historis

- [PHP 8.6 release](https://www.php.net/releases/8.6/en.php), [Windows downloads](https://www.php.net/downloads.php?os=windows), dan [perubahan inkompatibel](https://www.php.net/manual/en/migration86.incompatible.php).
- [Laravel support policy](https://laravel.com/framework/docs/13.x/releases), [metadata 13.43.0](https://github.com/laravel/framework/blob/v13.43.0/composer.json), [tes tag](https://github.com/laravel/framework/blob/v13.43.0/.github/workflows/tests.yml), [tes branch](https://github.com/laravel/framework/blob/13.x/.github/workflows/tests.yml).
- [Filament 5.12.0 dependencies](https://github.com/filamentphp/filament/blob/v5.12.0/packages/support/composer.json), [tes dan bypass upstream](https://github.com/filamentphp/filament/blob/v5.12.0/.github/workflows/tests.yml), [instalasi Filament](https://filamentphp.com/docs/5.x/introduction/installation).
- [Composer 2.11.1](https://getcomposer.org/changelog/2.11.1), [Composer platform checks](https://getcomposer.org/doc/03-cli.md#check-platform-reqs), [PHPUnit support](https://phpunit.de/supported-versions.html).
- [Laravel database support](https://laravel.com/framework/docs/13.x/database), [MySQL 8.0 EOL](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/).
- [Vite plugin engine](https://github.com/laravel/vite-plugin/blob/3.x/package.json), [Livewire/Alpine](https://livewire.laravel.com/docs/4.x/installation), [Tailwind browsers](https://tailwindcss.com/docs/compatibility).
- [setup-php](https://github.com/shivammathur/setup-php), [GitHub MySQL service runner constraints](https://docs.github.com/en/actions/tutorials/use-containerized-services/use-docker-service-containers), [Laravel Cloud runtimes](https://laravel.com/cloud/docs/runtimes).

## Lingkungan lokal yang diperiksa

Windows/Laragon: perintah `php` pada PATH masih menunjuk PHP CLI 8.5.10. Instalasi `D:/laragon/bin/php/php-8.5.12-Win32-vs17-x64/php.exe` sudah tersedia dan berhasil diperiksa langsung. Composer 2.10.2 juga bisa dijalankan dengan binary 8.5.12 tersebut. Apache dikonfigurasi ke PHP 8.5.12, tetapi konfigurasi belum membuktikan HTTP request memakai versi itu. Node 24.14.1 dan npm 11.11.0 diperiksa ulang. Audit sebelumnya mencatat MySQL client/proses server dari instalasi 8.4.3; belum ada query database aplikasi.

Pemeriksaan langsung 8.5.12 menggunakan `-v`, `-m`, dan Composer `--no-plugins --version` semuanya exit 0. Extension CLI target sudah ditemukan sebagaimana tabel terbaru. Tidak ada Composer manifest/lock aplikasi atau frontend manifest aplikasi; paket di direktori validasi GitHub hanya alat CI M0. PATH global, konfigurasi Laragon, dan layanan tidak diubah dalam penyelarasan dokumen ini.

Untuk pemeriksaan berikutnya, gunakan binary target secara eksplisit sampai terminal diselaraskan; perintah PowerShell yang telah dijalankan:

```powershell
& 'D:\laragon\bin\php\php-8.5.12-Win32-vs17-x64\php.exe' -v
& 'D:\laragon\bin\php\php-8.5.12-Win32-vs17-x64\php.exe' -m
& 'D:\laragon\bin\php\php-8.5.12-Win32-vs17-x64\php.exe' 'D:\laragon\bin\composer\composer.phar' --no-plugins --version
```

## Kriteria gate sebelum scaffolding

1. Catat versi/tag stabil PHP, Laravel, Filament, MySQL, Composer, test runner, semua paket tambahan dan extension, lengkap dengan sumber/tanggal. Rujukan: PRD §3.
2. Siapkan eksperimen kompatibilitas terisolasi dengan scope yang diterima owner; jangan menjadikannya scaffolding aplikasi terselubung dalam Fase 3–4. Selaraskan CLI/web/CI ke PHP 8.5.12 dan catat build Windows atau Linux. Rujukan: PRD §§3, 9.6.
3. Resolve/install dependency tanpa `--ignore-platform-reqs` maupun `--ignore-platform-req=php+`. `config.platform.php` bukan eksekusi runtime. Jalankan `composer check-platform-reqs`, validasi lock, dan audit dependency yang benar-benar dipilih. Catat output dan exit code. Rujukan: PRD §§3, 8, 11.
4. Uji bootstrap framework, panel/auth/authorization, CRUD dan PDO MySQL pada runtime target di eksperimen yang diizinkan. Daftar tes lanjutan aplikasi mengikuti PRD §8 setelah M1, bukan klaim tes yang sudah ada.
5. Verifikasi hosting staging/production menyediakan PHP 8.5.12 web/CLI, extension, database, storage privat/publik, email/worker/scheduler sesuai pilihan, serta backup/rollback. Catat ketidaktersediaan sebagai blocker; bila host hanya menawarkan patch lain, ajukan keputusan versi kepada owner. Rujukan: PRD §§3, 6.3, 8, 11–12.
6. Owner menerima bukti kelulusan kompatibilitas secara tertulis; penerimaan M0 juga dibutuhkan sebelum M1. Target 8.5.12 sudah dipilih owner, tetapi bukti kelulusan belum diterima dan Fase 5 belum diizinkan. Rujukan: PRD §§10–13.

## Dampak keputusan dan blocker yang tersisa

Usulan historis memakai seri 8.5 sebagai workaround sementara menuju 8.6 telah digantikan oleh keputusan target **8.5.12** pada PRD §13. Tidak ada rencana kembali ke 8.6 yang otomatis berlaku. Perubahan patch/minor berikutnya tetap memerlukan keputusan owner dan bukti kompatibilitas sesuai PRD §§3, 13.

Blocker saat ini: PATH terminal masih 8.5.10 dan PHP web belum diverifikasi; dependency graph aplikasi belum ditentukan/diuji; matriks PHP 8.5.12/MySQL belum berjalan; host dan dukungan patch tepat belum dipilih/diverifikasi. Tidak menghalangi dokumentasi M0; tetap menghalangi klaim siap M1.
