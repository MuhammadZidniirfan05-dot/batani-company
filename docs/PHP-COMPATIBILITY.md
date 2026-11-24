# Gate kompatibilitas PHP dan stack

Acuan: [PRD](PRD.md) §§3, 8, 9.6, 10–13. Status: **BELUM LULUS**. PHP **8.6** tetap target approved baseline. Laravel **13**, Filament **5**, MySQL **8.x**, Blade/Tailwind/Alpine/Vite tetap rencana. Tidak ada instalasi/scaffolding aplikasi atau perubahan versi dalam Fase 3–4.

## Tingkat bukti

Pisahkan ketersediaan rilis, constraint paket, dukungan vendor, konfigurasi tes upstream, hasil tes aktual, dan kemampuan host. Constraint Composer yang menerima versi lebih baru tidak membuktikan perilaku runtime. Workflow upstream bukan bukti run sukses milik proyek.

Tabel berikut merangkum sumber resmi yang diperiksa pada audit Fase 1–2 tanggal 2026-11-24. Ini rekaman bukti bertanggal, bukan janji bahwa release/branch terbaru selalu sama. Pemeriksaan Fase 3–4 mengonfirmasi lingkungan lokal; tidak menjalankan ulang matriks aplikasi.

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

## Sumber primer

- [PHP 8.6 release](https://www.php.net/releases/8.6/en.php), [Windows downloads](https://www.php.net/downloads.php?os=windows), dan [perubahan inkompatibel](https://www.php.net/manual/en/migration86.incompatible.php).
- [Laravel support policy](https://laravel.com/framework/docs/13.x/releases), [metadata 13.43.0](https://github.com/laravel/framework/blob/v13.43.0/composer.json), [tes tag](https://github.com/laravel/framework/blob/v13.43.0/.github/workflows/tests.yml), [tes branch](https://github.com/laravel/framework/blob/13.x/.github/workflows/tests.yml).
- [Filament 5.12.0 dependencies](https://github.com/filamentphp/filament/blob/v5.12.0/packages/support/composer.json), [tes dan bypass upstream](https://github.com/filamentphp/filament/blob/v5.12.0/.github/workflows/tests.yml), [instalasi Filament](https://filamentphp.com/docs/5.x/introduction/installation).
- [Composer 2.11.1](https://getcomposer.org/changelog/2.11.1), [Composer platform checks](https://getcomposer.org/doc/03-cli.md#check-platform-reqs), [PHPUnit support](https://phpunit.de/supported-versions.html).
- [Laravel database support](https://laravel.com/framework/docs/13.x/database), [MySQL 8.0 EOL](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/).
- [Vite plugin engine](https://github.com/laravel/vite-plugin/blob/3.x/package.json), [Livewire/Alpine](https://livewire.laravel.com/docs/4.x/installation), [Tailwind browsers](https://tailwindcss.com/docs/compatibility).
- [setup-php](https://github.com/shivammathur/setup-php), [GitHub MySQL service runner constraints](https://docs.github.com/en/actions/tutorials/use-containerized-services/use-docker-service-containers), [Laravel Cloud runtimes](https://laravel.com/cloud/docs/runtimes).

## Lingkungan lokal yang diperiksa

Windows/Laragon: PHP CLI 8.5.10; Composer 2.10.2 memakai CLI tersebut; Apache dikonfigurasi ke PHP 8.5.12. Konfigurasi bukan bukti HTTP request memakai versi itu. Node 24.14.1, npm 11.11.0, MySQL client 8.4.3. Audit sebelumnya menemukan proses server dari instalasi MySQL 8.4.3, tetapi tidak ada query database aplikasi.

Audit PHP CLI sebelumnya menemukan extension dasar Laravel dan `pdo_mysql`, `intl`, GD, ZIP. Ini hanya bukti untuk CLI 8.5.10, bukan extension PHP 8.6 atau PHP web. Tidak ada Composer manifest/lock aplikasi atau frontend manifest aplikasi; paket di direktori validasi GitHub hanya alat CI M0.

## Kriteria gate sebelum scaffolding

1. Catat versi/tag stabil PHP, Laravel, Filament, MySQL, Composer, test runner, semua paket tambahan dan extension, lengkap dengan sumber/tanggal. Rujukan: PRD §3.
2. Siapkan eksperimen kompatibilitas terisolasi dengan scope yang diterima owner; jangan menjadikannya scaffolding aplikasi terselubung dalam Fase 3–4. Selaraskan CLI/web/CI dan catat build Windows atau Linux. Rujukan: PRD §§3, 9.6.
3. Resolve/install dependency tanpa `--ignore-platform-reqs` maupun `--ignore-platform-req=php+`. `config.platform.php` bukan eksekusi runtime. Jalankan `composer check-platform-reqs`, validasi lock, dan audit dependency yang benar-benar dipilih. Catat output dan exit code. Rujukan: PRD §§3, 8, 11.
4. Uji bootstrap framework, panel/auth/authorization, CRUD dan PDO MySQL pada runtime target di eksperimen yang diizinkan. Daftar tes lanjutan aplikasi mengikuti PRD §8 setelah M1, bukan klaim tes yang sudah ada.
5. Verifikasi hosting staging/production menyediakan PHP 8.6 web/CLI, extension, database, storage privat/publik, email/worker/scheduler sesuai pilihan, serta backup/rollback. Catat ketidaktersediaan sebagai blocker. Rujukan: PRD §§3, 6.3, 8, 11–12.
6. Owner menerima bukti dan keputusan runtime secara tertulis; penerimaan M0 juga dibutuhkan sebelum M1. Tidak ada persetujuan tersebut dalam fase ini. Rujukan: PRD §§10–13.

## Alternatif sementara, belum disetujui

Jika ada blocker, opsi adalah melanjutkan dokumentasi sambil menunggu dependency/host yang mendukung, atau mengusulkan PHP 8.5 patch terpelihara untuk pekerjaan interim yang disetujui secara eksplisit. Opsi kedua bukan pengganti target PHP 8.6 dan tidak mengizinkan produksi/scaffolding otomatis. Catat scope, batas waktu, tes pembanding, dan jalur kembali ke 8.6 sebelum meminta keputusan owner (PRD §§3, 13).

Blocker saat ini: runtime lokal bukan target, dependency graph aplikasi belum ditentukan/diuji, matriks PHP/MySQL belum berjalan, host belum dipilih, dan bukti dukungan release belum lengkap. Tidak menghalangi dokumentasi M0; tetap menghalangi klaim siap M1.
