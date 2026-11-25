# Menjalankan fondasi Laravel

Acuan: [PRD](PRD.md) §§3, 8–11, 13 v1.7 dan [Issue #8](https://github.com/MuhammadZidniirfan05-dot/batani-company/issues/8). Scope ini berisi fondasi Laravel/Blade, belum modul CMS atau desain final. Gunakan PHP **8.5.12**, Composer 2, Node 24 dan npm 11. Versi paket aktual dikunci pada [composer.lock](../composer.lock) dan [package-lock.json](../package-lock.json).

## Windows / Laragon

Terminal mesin ini masih dapat menunjuk PHP 8.5.10. Dari root repository, gunakan binary target secara eksplisit; perubahan ini tidak mengganti PATH global:

```powershell
$phpBin = 'D:/laragon/bin/php/php-8.5.12-Win32-vs17-x64/php.exe'
$composerPhar = 'D:/laragon/bin/composer/composer.phar'
& $phpBin $composerPhar install --no-interaction --prefer-dist --no-plugins
if (-not (Test-Path -LiteralPath .env)) {
    Copy-Item -LiteralPath .env.example -Destination .env
    & $phpBin artisan key:generate --no-interaction
}
npm ci --ignore-scripts --no-audit --no-fund
npm run build
& $phpBin artisan serve --host=127.0.0.1 --port=8001
```

Buka `http://127.0.0.1:8001`; health endpoint ada pada `/up`. Port 8000 sudah dipakai proses lain pada mesin ini. Task VS Code `Laravel: serve (PHP 8.5.12)` memakai binary yang sama dan bind loopback. Task build aset menjalankan `npm run build`. Untuk perubahan frontend secara langsung, jalankan `npm run dev` di terminal lain dan tetap jalankan server PHP. Pada Laragon/Apache, document root harus menunjuk direktori [public](../public), bukan root repository; runtime Apache harus diperiksa terpisah dari CLI.

Jangan mencetak atau commit isi `.env`/APP_KEY. Perintah di atas hanya membuat environment jika belum ada dan tidak mengganti key existing. Contoh environment berisi nama akun/database nonrahasia yang harus disesuaikan secara lokal. `APP_DEBUG=false` secara default; aktifkan hanya untuk diagnosis lokal bila diperlukan.

## Database dan efek samping

Contoh konfigurasi memakai MySQL (`batani_company`, akun contoh `batani_local`). Session/cache lokal memakai file dan queue memakai sync agar halaman awal dapat berjalan sebelum database disiapkan. Konfigurasi ini bukan bukti koneksi MySQL berhasil.

Tidak ada migrasi otomatis dalam instalasi/setup. Migration bawaan Laravel untuk user/session/cache/jobs tersedia, tetapi belum dijalankan pada MySQL existing. Setelah database pengembangan khusus dan aksesnya disiapkan pada penugasan terkait, tinjau koneksi sebelum menjalankan `php artisan migrate`. Jangan memakai `migrate:fresh` pada database yang berisi pekerjaan lain. Seeder tidak membuat akun/password default.

## Pemeriksaan

```powershell
& $phpBin $composerPhar validate --strict
& $phpBin $composerPhar check-platform-reqs
& $phpBin $composerPhar audit
& $phpBin vendor/bin/pint --test
& $phpBin artisan test
npm run build
npm ci --prefix .github/validation --ignore-scripts --no-audit --no-fund
node .github/validation/validate.mjs
node --test .github/validation/validate.test.mjs
node --permission --allow-fs-read=tools/agent-review tools/agent-review/test/policy.test.mjs
git diff --check
```

Tes fondasi menguji Blade, escaping nama, HTTP 404 dan health tanpa MySQL. [phpunit.xml](../phpunit.xml) memaksa koneksi SQLite memory dan URL database kosong untuk mencegah pemakaian database lokal pada tes. Ini bukan pengujian integrasi MySQL/CMS. PHPUnit dipilih dari scaffold resmi dan dikunci bersama dependency; belum ada lapisan/service bisnis yang perlu dibuat.

[Laravel CI](../.github/workflows/application.yml) menjalankan image resmi PHP 8.5.12 yang dikunci digest, verifikasi versi runtime, validasi/install/audit Composer, Pint, tes dan build aset pada runner tanpa secret/izin tulis/deployment. Composer 2.10.2 diverifikasi SHA-256 sebelum dipakai. Image dipilih karena setup PHP berbasis paket runner memasang 8.5.13 meskipun input 8.5.12; pemeriksaan exact version berhasil menolak run awal tersebut. [M0 CI](../.github/workflows/ci.yml) tetap menjalankan validator dan simulator. Kelulusan CI bukan penerimaan M0 atau izin merge/deploy.

## Integrasi MySQL CI untuk Issue #10

`php artisan test` tetap menggunakan SQLite memory dan tidak memerlukan MySQL. Suite integrasi terpisah dijalankan hanya dengan perintah berikut pada service MySQL CI sementara:

```text
php vendor/bin/phpunit --configuration phpunit.mysql.xml --fail-on-empty-test-suite --fail-on-skipped
```

Job CI memasang MySQL resmi **8.4.7** yang dikunci digest `sha256:0426ec38c7a10aa45ba383887df7878f74ee70e2fd589c7b69207f3577901903`. Service membuat schema `batani_company_ci_test` dan akun `batani_ci_test` khusus schema tersebut; kredensial sintetis hanya berlaku untuk service yang hilang sesudah job, tanpa port host atau volume persisten. [Bootstrap suite](../tests/Support/bootstrap-mysql.php) menetapkan environment testing, driver, host `mysql`, port `3306`, socket kosong, schema, user, URL kosong dan password sintetis sebelum aplikasi boot. Bootstrap menimpa environment proses serta `.env`; XML PHPUnit saja tidak menimpa environment proses yang sudah ada. Langkah CI menyediakan opt-in eksplisit. Setup integrasi memeriksa konfigurasi efektif Laravel, cache konfigurasi, opt-in, serta tujuan koneksi termasuk socket **sebelum** migration. Tes negatif menggunakan spy pada batas migration/koneksi dan tidak mengakses database. Koneksi salah, opt-in hilang, atau service mati membuat suite gagal, bukan skip. Migration bawaan hanya berjalan pada service ini; aplikasi pada MySQL Laragon atau hosting belum diuji.

Jangan menjalankan perintah suite MySQL terhadap database existing, sekalipun nama schema tampak serupa. Untuk reproduksi, gunakan run CI pada PR Issue #10 yang menyediakan service sekali pakai. Pengujian lokal default tidak mengubah konfigurasi MySQL/`.env` yang sudah ada.
