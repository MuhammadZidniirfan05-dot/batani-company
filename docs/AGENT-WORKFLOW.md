# Runbook GitHub dan alur agent

Acuan: [PRD](PRD.md) §§2, 9, 11–13; [AGENTS](../AGENTS.md). Tanggal inspeksi: 2026-11-24. Status Fase 4.5: remote dan akses GitHub terverifikasi; publikasi branch/PR dan CI GitHub menunggu persetujuan. Integrasi agent belum operasional.

## Status repository dan bootstrap

Fase 3–4 menginisialisasi repository lokal pada branch `chore/m0-workflow-foundation`. Commit awal `833603d` menyimpan [PRD](PRD.md) dan [README](../README.md) asli; `cf440b6` menambahkan fondasi M0. Keduanya dipertahankan tanpa rebase, amend, atau reset. Ref checkpoint milik agent host juga dibiarkan utuh dan tidak termasuk ref yang akan dipublikasikan.

Keputusan owner dalam penugasan **PLANNER — PHASE 4.5: GITHUB INTEGRATION**, 2026-11-24: gunakan repository resmi [MuhammadZidniirfan05-dot/batani-company](https://github.com/MuhammadZidniirfan05-dot/batani-company) untuk folder lokal `D:/laragon/www/batani-company`; jangan membuat repository lain. Keputusan eksplisit ini menggantikan contoh nama `company-profile-cms` dalam panduan awal sesuai PRD §13. [PRD](PRD.md) dan [README](../README.md) asli tidak diubah. Instruksi membuat repository baru pada README bukan langkah yang perlu diulang untuk proyek ini.

Fase 4.5 mengizinkan inspeksi, konfigurasi remote lokal, dan persiapan PR, tetapi mewajibkan persetujuan sebelum mengubah riwayat remote. Bootstrap ini belum memiliki Issue dan tidak membuat nomor palsu. Tidak ada izin melanjutkan Fase 5, merge, atau deployment.

### Bukti inspeksi GitHub Fase 4.5

| Pemeriksaan aktual | Hasil pada 2026-11-24 | Implikasi |
|---|---|---|
| `gh auth status`; `gh repo view` repository resmi | Akun aktif `MuhammadZidniirfan05-dot`; repository private; `viewerPermission: ADMIN` | Akses baca/admin terverifikasi; izin bukan persetujuan push |
| API metadata repository | `default_branch: main`, `size: 0`, tidak archived/disabled; permission pull/push/admin true | Nama default dikonfigurasi main, tetapi belum ada ref branch |
| API branches; API commits | Branches `[]`; commits HTTP 409 `Git Repository is empty.` | Tidak ada riwayat remote yang perlu digabungkan; bukan kesalahan otentikasi |
| `git remote -v`; fetch dengan credential helper GitHub CLI | `origin` menunjuk URL resmi HTTPS; fetch exit 0, tidak menerima ref | Remote lokal tersambung tanpa mengubah remote history |
| API Actions permissions | `enabled: true`, `allowed_actions: all`, `sha_pinning_required: false` | CI diizinkan secara konfigurasi; workflow kita tetap mengunci action ke SHA |
| API default workflow permissions | `read`; `can_approve_pull_request_reviews: false` | Default token baca dan approval oleh workflow tidak diaktifkan |
| API workflows / workflow runs | Keduanya `total_count: 0` | Belum ada CI GitHub; kelulusan lokal bukan run Actions |
| API branch protection / rulesets | Keduanya HTTP 403: `Upgrade to GitHub Pro or make this repository public to enable this feature.` | Kontrol merge native terhambat entitlement plan saat ini; tidak menyimpulkan nama plan akun |
| API collaborators | Hanya owner sebagai admin | Reviewer berwenang yang berbeda dari pembuat PR belum tersedia di daftar collaborator |
| API labels | Label bawaan tersedia, termasuk `bug`; `feature` dan `chore` belum ada | Label proyek perlu dibuat sebelum Issue Forms digunakan |
| API environments | `total_count: 0` | Staging/production belum dikonfigurasi; tidak membuat atau mengaktifkannya |
| API commit action checkout dan setup-node | SHA yang tercantum dalam [CI](../.github/workflows/ci.yml) ditemukan pada repository resmi masing-masing | Referensi action valid; belum membuktikan eksekusi runner |

Token GitHub CLI mempunyai scope `repo`, `workflow`, `read:org`, dan `gist`; tidak ada bukti scope Projects. `has_projects: true` pada metadata hanya menunjukkan fitur diizinkan, bukan board atau state workflow sudah tersedia. Identitas/login lokal tidak boleh diteruskan sebagai secret agent/CI. Tidak ada pengaturan GitHub yang diubah pada inspeksi ini.

### Persiapan publikasi yang memerlukan persetujuan

Branch lokal `main` disiapkan pada `833603d`; branch `chore/m0-workflow-foundation` tetap memuat seluruh fondasi dan commit dokumentasi integrasi. Tidak perlu cherry-pick atau penggabungan unrelated histories karena remote kosong. Publikasi direncanakan sebagai berikut (belum dijalankan):

1. Owner menyetujui publikasi **baseline main, branch fondasi, dan draft PR** secara eksplisit. Ini pengecualian bootstrap main yang hanya berisi dua dokumen asli, bukan push perubahan fondasi langsung ke main.
2. Fetch dan periksa refs remote lagi. Jika remote sudah berisi branch/commit baru, hentikan rencana bootstrap ini, bandingkan riwayat, lalu susun rencana baru; jangan menimpa perubahan tersebut.
3. Push hanya ref `main` lokal pada `833603d` ke `refs/heads/main` remote, kemudian branch fondasi ke nama yang sama. Jangan memakai `--all`, `--mirror`, `--force`, atau mengirim checkpoint agent host. Tidak ada commit/branch yang dihapus atau diubah ulang.
4. Buat draft PR dari `chore/m0-workflow-foundation` ke `main`, menggunakan [template PR](../.github/PULL_REQUEST_TEMPLATE.md). Judul: `chore: establish M0 workflow foundation and GitHub integration`. Catat otorisasi bootstrap tanpa Issue, SHA aktual, referensi PRD §§3, 9, 11, 13, bukti lokal, serta blocker proteksi/reviewer.
5. Verifikasi default branch main, commit remote sesuai lokal, diff PR, dan run `M0 CI` pada SHA yang tepat. Job yang direncanakan bernama `M0 validation`; konfirmasi nama/status dari run aktual. Hanya feature push/PR yang memiliki workflow; baseline main belum berisi CI.
6. Pertahankan PR sebagai draft selama kontrol merge/reviewer belum siap. Jangan merge, deploy, membuat Issue, atau melanjutkan Fase 5. Persetujuan push tidak berarti persetujuan tindakan tersebut.

Kriteria siap PR: baseline dan head teridentifikasi, diff M0 terbatas, PRD/README asli tetap, validasi lokal lulus, remote resmi terverifikasi, serta risiko/otorisasi publikasi tercatat. Kriteria integrasi CI selesai memerlukan URL PR dan run GitHub yang benar-benar lulus; saat ini keduanya **pending**. Proteksi branch dan review independen tetap gate terpisah sebelum merge menurut PRD §§9.5, 11.

Untuk hambatan plan, owner dapat mengevaluasi peningkatan plan yang mendukung proteksi repository private; jangan mengubah visibility menjadi public secara otomatis. Jika menggunakan kontrol setara, mekanisme dan bukti enforceability harus disetujui secara eksplisit terlebih dahulu. Menunggu kontrol ini tidak menghalangi persiapan draft PR, tetapi merge tetap BLOCKED.

## Peran dan handoff

| Peran | Tugas | Bukti keluar / batas akses |
|---|---|---|
| Planner, model reasoning tinggi | Baca PRD, analisis arsitektur/risiko, pecah pekerjaan dan kontrak Issue | Scope, dependencies, AC, rencana tes; tidak rutin membuat fitur |
| Executor, model coding ekonomis | Baca Issue READY dan aturan; implementasi branch; jalankan pemeriksaan; PR dan rework | Diff/SHA, hasil aktual, keterbatasan; tanpa production credentials |
| Reviewer, model reasoning tinggi | Baca Issue, diff, CI, keamanan dan regresi pada SHA terbaru | APPROVED / CHANGES_REQUESTED / BLOCKED; tidak mengarang bukti |
| Human Owner | Putuskan perubahan kebutuhan/arsitektur/risiko, akses dan release | Persetujuan tercatat; production approval selalu terpisah |

Owner/maintainer mengirim paket handoff secara manual sampai integrasi diverifikasi. Paket minimal: URL Issue, referensi PRD, scope, dependencies, AC, branch/base SHA, PR/head SHA jika ada, hasil CI, risiko, dan temuan terdahulu. Planner/Reviewer mahal hanya dipanggil ketika keputusan atau review substantif diperlukan. Setelah rework, kirim delta dan bukti baru untuk menghindari evaluasi berulang tanpa perubahan.

## Status dan transisi

Semua status ini mengikuti PRD §9.2. Tidak ada bot yang memindahkannya saat ini. Owner/maintainer mencatat status di Projects atau di Issue bila Projects tidak tersedia.

| Transisi | Pihak yang berwenang | Bukti wajib |
|---|---|---|
| Awal → BACKLOG | Planner/owner | Draft kontrak dan referensi PRD |
| BACKLOG → READY | Owner/maintainer setelah pemeriksaan Planner | Kontrak lengkap; dependensi selesai; keputusan risiko diterima; Executor/Reviewer ditentukan |
| READY → IN_PROGRESS | Executor yang ditugaskan | Branch khusus; scope dipahami; ownership jelas |
| IN_PROGRESS → IN_REVIEW | Executor | PR terkait Issue, SHA, AC dan bukti tes; CI harus lulus sebelum review final |
| IN_REVIEW → CHANGES_REQUESTED | Reviewer | Temuan lengkap sesuai protokol |
| CHANGES_REQUESTED → IN_PROGRESS | Executor | Pengakuan temuan dan rencana koreksi pada PR yang sama |
| IN_PROGRESS → IN_REVIEW setelah koreksi | Executor | SHA baru, hasil tes/CI baru, respons per temuan |
| IN_REVIEW → APPROVED | Reviewer | Seluruh AC dan pemeriksaan terpenuhi; tidak ada temuan blocking pada SHA terbaru |
| APPROVED → MERGED | Owner/maintainer dengan merge permission | Required checks dan review GitHub benar-benar terpenuhi; persetujuan risiko bila perlu |
| MERGED → STAGING | Operator rilis yang ditunjuk owner | Deploy staging aktual, artefak/SHA dan hasil verifikasi |
| STAGING → PRODUCTION_APPROVAL | Operator/owner | UAT, backup dan rollback siap; permintaan persetujuan artefak tertentu |
| PRODUCTION_APPROVAL → DEPLOYED | Owner menyetujui; operator menjalankan | Approval manusia dan bukti deploy/health check aktual |
| DEPLOYED → DONE | Owner/maintainer | Verifikasi pascarilis, dokumentasi, temuan tuntas |
| Status mana pun → BLOCKED | Penanggung jawab melaporkan; owner/maintainer mencatat | Alasan, status asal, pihak pembuka hambatan, dan bukti yang kurang |
| BLOCKED → status asal yang masih valid | Owner/maintainer bersama pihak terkait | Bukti hambatan selesai; evaluasi ulang approval/CI jika SHA berubah |

Untuk dokumentasi tanpa artefak deployment, aturan closure belum ditentukan PRD. Jangan memalsukan STAGING/DEPLOYED. Usulan shortcut MERGED → DONE memerlukan keputusan owner tercatat; sebelum itu tandai gate tersebut N/A-pending-decision dan simpan status terakhir yang valid. Ini bukan perubahan state machine secara sepihak.

## CI dan review

[CI](../.github/workflows/ci.yml) bernama `M0 CI`, dengan nama check yang direncanakan `M0 validation`. Trigger: push pada branch yang tercantum, PR ke main, dan manual dispatch. Tidak memakai path filter agar required check tidak hilang ketika berkas lain berubah. Tidak ada `pull_request_target`, akses secret, atau token tulis. Checkout tidak menyimpan kredensial Git. Action dikunci SHA; dependensi validator dikunci lockfile.

CI menjalankan Node untuk validasi dokumen/YAML/form/PR/template deployment yang memang ada, bukan PHP, Laravel, migrasi, atau build frontend. [Validator](../.github/validation/validate.mjs) juga bisa dijalankan lokal dengan perintah [AGENTS](../AGENTS.md). Kelulusan tidak membuktikan seluruh schema GitHub, keamanan menyeluruh, kebenaran isi Issue, maupun integrasi agent. Uji GitHub pertama masih wajib.

CI gagal → Executor memperbaiki; CI tidak tersedia → BLOCKED untuk approval final. CI lulus → Reviewer memeriksa acceptance criteria. CHANGES_REQUESTED wajib menyertakan finding, file/lokasi, severity, alasan, koreksi, dan verifikasi; gunakan [REVIEW-CHECKLIST](REVIEW-CHECKLIST.md). Perbarui PR yang sama. Komentar AI tidak menggantikan required check atau persetujuan manusia.

## Konfigurasi GitHub oleh admin, belum diterapkan

### Izin dan branch protection

1. Verifikasi pemilik, visibility, plan, akses admin repository, izin Actions, serta kebijakan organisasi. Projects membutuhkan akses tersendiri; scope token saat inspeksi tidak membuktikan akses itu.
2. Setelah baseline main tersedia, buat PR fondasi dan jalankan CI. Ambil nama check yang benar dari run aktual; pilih `M0 validation` dari aplikasi GitHub Actions. Jangan mewajibkan check Laravel/build yang belum ada.
3. Pada main, wajibkan PR, minimal satu approval Reviewer GitHub yang berwenang dan berbeda dari pembuat PR, dismissal stale approvals, penyelesaian percakapan, dan required status check untuk commit terbaru. Aktifkan pemeriksaan branch up-to-date bila sesuai kebijakan repo. Perubahan berisiko juga memerlukan keputusan owner tertulis.
4. Batasi bypass kepada manusia berwenang; agent tidak boleh memiliki bypass. Larang force-push/deletion main. Tinjau dampak sebelum mengubah aturan; jangan membuat aturan yang menutup satu-satunya jalur bootstrap sebelum check pertama tersedia.
5. AI review hanya menjadi review/check GitHub bila integrasinya memang memasukkan hasil ke API yang sesuai. Tetap pisahkan keputusan owner dan kendali produksi. Jika hanya satu akun yang membuat PR, siapkan reviewer lain atau akun integrasi terpisah sesuai aturan; jangan menganggap self-approval cukup.

Branch protection pada repository private memerlukan plan yang mendukung. Jika kontrol tidak tersedia, jangan mengklaim PR aman untuk merge menurut PRD §11; catat BLOCKED dan minta keputusan owner tentang plan atau mekanisme setara. Panduan: [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

### Label dan Projects

| Dimensi | Label / pilihan |
|---|---|
| Type | `feature`, `bug`, `chore` |
| Module | `module:workflow`, `module:runtime`, `module:cms`, `module:public`, `module:search-contact-seo`, `module:release` |
| Priority | `priority:P0` (insiden kritis), `priority:P1` (gate terhambat), `priority:P2` (normal), `priority:P3` (dapat ditunda) |
| Risk | `risk:low` (perubahan terbatas), `risk:medium` (perilaku/dependensi), `risk:high` (izin, data, requirement, release) |
| Responsibility | `agent:planner`, `agent:executor`, `agent:reviewer`, `owner:decision` |

Admin membuat label sebelum menggunakan form. Form memberi label tipe; module/priority/risk/agent dipetakan manual dari jawaban dan penugasan. Tidak ada sinkronisasi otomatis.

Buat Projects board dengan field Status berisi BACKLOG, READY, IN_PROGRESS, IN_REVIEW, CHANGES_REQUESTED, APPROVED, MERGED, STAGING, PRODUCTION_APPROVAL, DEPLOYED, DONE, BLOCKED. Tambahkan field Priority, Risk, Module, Agent owner, PRD reference, dan Dependencies. Gunakan transisi pada tabel di atas; jangan auto-close saat merge karena state release belum selesai. Jika Projects tidak didukung, gunakan riwayat status dalam Issue sebagai fallback terdokumentasi, bukan mengklaim board tersedia.

### Environment dan rilis

[Template staging](../.github/workflows/deploy-staging.yml) dan [template production](../.github/workflows/deploy-production.yml) hanya menerima manual dispatch dan seluruh job memakai kondisi false. Tidak ada environment binding, secret, checkout, atau perintah deploy. Bahkan dispatch tidak menjalankan deployment; template bukan required status check.

Sebelum implementasi rilis terpisah: owner menunjuk operator dan host, membuat environment staging/production secara nyata, memisahkan secrets, membatasi branch/tag yang diizinkan, dan menguji backup/rollback. Production harus memerlukan human approval untuk artefak/SHA yang sudah lolos staging. Kredensial production tidak boleh tersedia pada jobs PR/Executor. Gunakan identitas deploy terpisah dengan izin minimal; metode kredensial baru dipilih setelah provider ditentukan.

GitHub membatasi required environment reviewers di repository private menurut plan. Pro/Team bukan jaminan fitur tersebut. `workflow_dispatch` sendiri bukan approval manusia independen. Bila gate native tidak tersedia, owner perlu menyetujui dan memverifikasi kontrol rilis eksternal dengan kewenangan/kredensial terpisah; template tetap disabled sampai saat itu. Lihat [review deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments).

## Integrasi agent yang masih manual

Belum ada GitHub App, webhook, pemanggilan model, dispatcher, maupun reviewer bot. Sebelum menyebut alur otomatis: tentukan identitas/model dan budget, scope API minimal (contents/PR/Issues hanya sesuai tugas, Projects bila perlu), pengelolaan secret, sandbox terpisah, timeout/retry, idempotensi agar tidak membuat Issue/PR duplikat, dan log audit yang sudah diredaksi. Jangan memberikan administrasi repository atau production credential kepada Executor.

Bukti penerimaan nanti: satu Issue nyata yang diizinkan owner menghasilkan branch/PR, CI pada SHA yang benar, review, satu koreksi pada PR yang sama, lalu review ulang. Catat siapa menjalankan tiap langkah, izin, hasil, dan biaya. Tidak perlu deployment untuk membuktikan loop pengembangan tersebut; release tetap gate terpisah. Backlog usulan ada di [ROADMAP](ROADMAP.md); Fase 5 belum diizinkan.
