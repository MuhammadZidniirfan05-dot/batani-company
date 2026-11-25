# Runbook GitHub dan alur agent

Acuan: [PRD](PRD.md) §§2, 9, 11–13; [AGENTS](../AGENTS.md). Inspeksi terbaru: 2026-11-25. Repository sudah public; proteksi main belum dikonfigurasi. Keputusan owner memperbolehkan satu akun GitHub dengan agent/sesi Planner, Executor, Reviewer terpisah. Pemilihan model telah disepakati; penerapan dan bukti per run, integrasi status review tepercaya, serta isolasi kredensial masih pending. Draft PR dan CI pada head remote terverifikasi; integrasi agent belum operasional.

## Keputusan pemisahan agent, 2026-11-25

Owner menetapkan “untuk akun github yang sama itu tidak masalah” dan meminta agent berbeda untuk Planner, Executor, dan Reviewer. Sesuai PRD §§9.1, 13, Reviewer menggunakan tingkat reasoning dan kelas biaya lebih tinggi daripada Executor; ID model target dan dasar perbandingan biaya telah ditetapkan, sedangkan identitas model aktual dan reasoning harus dibuktikan pada setiap run. Akun GitHub kedua bukan lagi blocker proyek. Usulan sebelumnya yang mewajibkan satu approval native non-author telah digantikan keputusan ini dan tidak pernah diaktifkan.

Laporan agent bukan approval native GitHub. Akun yang sama tidak membuktikan pemisahan sesi/model. Jika semua agent memperoleh kredensial admin yang sama, pemisahan peran belum ditegakkan secara teknis. Blocker saat ini adalah integrasi hasil review tepercaya, pemisahan izin, bukti penerapan peran/model aktual, dan verifikasi gate sebelum merge.

## Pilihan model dan basis biaya yang disetujui, 2026-11-25

Owner menyetujui Planner dan Reviewer `gpt-6-astra` / `high` serta Executor/Worker `gpt-6.1-sol` / `medium`, dengan agent/sesi terpisah untuk setiap peran (PRD §§9.1, 13). Snapshot [harga resmi](https://learn.chatgpt.com/docs/pricing) tanggal 2026-11-25 pada mode Standard, per satu juta token, mencatat Astra: input 250, cached input 25, output 1.250 credits; Sol 6.1: input 50, cached input 2,5, output 250 credits. Pada basis tersebut kelas biaya Astra lebih tinggi daripada Sol 6.1; total biaya run tetap bergantung pada pemakaian. Angka credits ini tidak menyatakan tarif penagihan API, yang terpisah. Identitas model merujuk pada [dokumentasi model resmi](https://learn.chatgpt.com/docs/models).

Penetapan model/effort adalah target yang disepakati; bukti model aktual, reasoning, dan pemisahan sesi wajib dicatat per run. Luna tetap merupakan opsi terdahulu untuk tugas kecil, bukan Worker default. Blade ditegaskan sebagai tampilan publik yang implementasinya menunggu workflow berjalan dan M0 diterima (PRD §§3, 13). Persetujuan ini tidak mengaktifkan integrasi, mengizinkan scaffolding, push, merge, deployment, atau Fase 5.

## Keputusan target PHP setelah review M0

Pada 2026-11-24 owner meminta “oiya saya ingin untuk phpnya veri 8.5 12”. Sesuai [PRD §13](PRD.md#13-change-control-and-precedence), target resmi berubah menjadi **PHP 8.5.12**. Penyelarasan lokal mencakup PRD versi 1.2, README, instruksi agent, arsitektur, roadmap, catatan kompatibilitas, serta hash baseline validator; pengaman baseline tetap aktif. Keputusan versi tidak meluluskan gate kompatibilitas dan tidak mengizinkan Fase 5, merge, atau deployment.

Bukti bootstrap di bawah adalah riwayat sebelum keputusan ini: PRD/README memang belum berubah pada commit yang disebut. Snapshot sebelum publikasi pembaruan 2026-11-25 masih berada pada head `1d6f1a9`; CI head tersebut tidak membuktikan validasi paket versi 1.4. Otorisasi publikasi pembaruan dicatat di bawah; hasil push, SHA baru, dan CI dicatat pada deskripsi/checks PR #1 setelah diperoleh, tanpa mengubah bukti historis menjadi klaim untuk commit terbaru.

## Snapshot sebelum publikasi pembaruan, 2026-11-25

Owner menyampaikan “oke repo sudah saya ubah jadi public”. Pemeriksaan GitHub mengonfirmasi perubahan tersebut sesuai kewenangan owner pada PRD §§9.5, 13. Agent hanya memeriksa hasil; tidak mengubah visibility.

| Pemeriksaan | Bukti aktual | Status |
|---|---|---|
| Metadata repository resmi | `visibility: PUBLIC`, `viewerPermission: ADMIN`, default branch `main` | Terverifikasi |
| Proteksi main | Metadata branch `protected: false`; endpoint protection HTTP 404 `Branch not protected` | Belum dikonfigurasi; bukan lagi HTTP 403 keterbatasan plan |
| Rulesets repository | API berhasil, hasil `[]` | Belum ada ruleset |
| PR #1 | OPEN/DRAFT; head `1d6f1a987664db8805e140cc1005a9c884c1c59d`; base `833603ddc4c126ee70c7549989b49cec5a6442f7` | Tidak berubah |
| CI head PR | Dua check `M0 validation` sukses pada head yang sama, dari `github-actions` (App ID `15368`) | Eksekusi lulus; belum menjadi required check |
| Reviewer | Reviews dan review requests kosong; collaborator hanya owner/admin | Bukti native tetap kosong; keputusan terbaru mewajibkan Reviewer agent terpisah, bukan akun GitHub kedua |
| Perubahan lokal target PHP 8.5.12 | Masih pada branch `chore/m0-workflow-foundation`, belum di-commit/push | CI remote belum memeriksa perubahan lokal |

### Otorisasi publikasi pembaruan PR #1, 2026-11-25

Owner menjawab **“oke silakan”** atas permintaan konkret untuk commit 11 berkas pembaruan M0, push ke `chore/m0-workflow-foundation`, memperbarui deskripsi PR #1, dan memeriksa CI pada commit baru. Paket mencakup keputusan yang sudah disetujui pada PRD §13, penyelarasan dokumen/template/validator, serta perbaikan petunjuk README. Izin ini tidak mencakup merge, perubahan proteksi, deployment, pembuatan Issue, atau Fase 5.

Sebelum publikasi, branch lokal dan remote diperiksa sama-sama pada `1d6f1a987664db8805e140cc1005a9c884c1c59d`; main tetap `833603ddc4c126ee70c7549989b49cec5a6442f7`. Publikasi menambahkan commit pada branch yang sama tanpa amend, rebase, force-push, penghapusan branch, atau pengiriman ref checkpoint agent. Catatan ini merekam otorisasi dan pemeriksaan sebelum push; bukti hasil publikasi dan CI terbaru menjadi bagian deskripsi/checks [PR #1](https://github.com/MuhammadZidniirfan05-dot/batani-company/pull/1). PR tetap draft selama penerimaan review dan kontrol merge belum terpenuhi (PRD §§9.4–9.5, 11).

Konfigurasi main berikut diselaraskan dengan keputusan pemisahan agent dan disiapkan untuk persetujuan owner, mengacu PRD §§9.5, 11. [AGENTS](../AGENTS.md) mewajibkan otorisasi sebelum mengubah proteksi. Keputusan visibility dan workflow tidak dianggap sebagai izin mengaktifkan konfigurasi ini.

| Pengaturan yang diusulkan | Nilai |
|---|---|
| Required status check | `M0 validation`, sumber GitHub Actions / App ID `15368` |
| Required review status | `Agent review`, publisher tepercaya yang masih perlu diintegrasikan |
| Branch harus mengikuti base terbaru | `strict: true` |
| PR dan approval native | Wajib PR; `required_approving_review_count: 0` |
| Approval code owner / push terakhir | `require_code_owner_reviews: false`, `require_last_push_approval: false` |
| Review setelah perubahan | Head/base berubah membatalkan kelulusan `Agent review`; perlu review ulang, bukan mengandalkan dismissal native approval |
| Percakapan review | Wajib diselesaikan |
| Penerapan kepada admin | `enforce_admins: true`; tidak mengandalkan bypass admin |
| Force-push dan penghapusan main | Keduanya tidak diizinkan |

GitHub mengizinkan required approval count 0; lihat [API branch protection](https://docs.github.com/en/rest/branches/branch-protection). Konfigurasi ini tetap memerlukan integrasi `Agent review` dan verifikasi perilaku aktual sebelum disebut operasional. Penerapan aturan akan menahan merge sampai CI dan status review terpenuhi, termasuk untuk owner. Setelah diizinkan, verifikasi nilai lewat API protection dan status PR; jangan menguji larangan dengan force-push, penghapusan branch, atau percobaan merge pada repository ini. Aktivasi aturan tidak memberikan izin merge, push perubahan lokal, deploy, atau Fase 5. Riwayat di bawah mempertahankan kondisi dan penilaian saat repository masih private.

## Riwayat repository dan bootstrap, 2026-11-24

Fase 3–4 menginisialisasi repository lokal pada branch `chore/m0-workflow-foundation`. Commit awal `833603d` menyimpan [PRD](PRD.md) dan [README](../README.md) asli; `cf440b6` menambahkan fondasi M0. Keduanya dipertahankan tanpa rebase, amend, atau reset. Ref checkpoint milik agent host juga dibiarkan utuh dan tidak termasuk ref yang akan dipublikasikan.

Keputusan owner dalam penugasan **PLANNER — PHASE 4.5: GITHUB INTEGRATION**, 2026-11-24: gunakan repository resmi [MuhammadZidniirfan05-dot/batani-company](https://github.com/MuhammadZidniirfan05-dot/batani-company) untuk folder lokal `D:/laragon/www/batani-company`; jangan membuat repository lain. Keputusan eksplisit ini menggantikan contoh nama `company-profile-cms` dalam panduan awal sesuai PRD §13. [PRD](PRD.md) dan [README](../README.md) asli tidak diubah. Instruksi membuat repository baru pada README bukan langkah yang perlu diulang untuk proyek ini.

Fase 4.5 mengizinkan inspeksi, konfigurasi remote lokal, dan persiapan PR, tetapi mewajibkan persetujuan sebelum mengubah riwayat remote. Bootstrap ini belum memiliki Issue dan tidak membuat nomor palsu. Tidak ada izin melanjutkan Fase 5, merge, atau deployment.

### Bukti inspeksi GitHub sebelum publikasi Fase 4.5

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

### Rencana bootstrap yang disetujui dan dijalankan

Branch lokal `main` disiapkan pada `833603d`; branch `chore/m0-workflow-foundation` tetap memuat seluruh fondasi dan commit dokumentasi integrasi. Tidak perlu cherry-pick atau penggabungan unrelated histories karena remote kosong. Rencana berikut disetujui owner dan dilaksanakan pada 2026-11-24; bukti hasil ada sesudah daftar ini:

1. Owner menyetujui publikasi **baseline main, branch fondasi, dan draft PR** secara eksplisit. Ini pengecualian bootstrap main yang hanya berisi dua dokumen asli, bukan push perubahan fondasi langsung ke main.
2. Fetch dan periksa refs remote lagi. Jika remote sudah berisi branch/commit baru, hentikan rencana bootstrap ini, bandingkan riwayat, lalu susun rencana baru; jangan menimpa perubahan tersebut.
3. Push hanya ref `main` lokal pada `833603d` ke `refs/heads/main` remote, kemudian branch fondasi ke nama yang sama. Jangan memakai `--all`, `--mirror`, `--force`, atau mengirim checkpoint agent host. Tidak ada commit/branch yang dihapus atau diubah ulang.
4. Buat draft PR dari `chore/m0-workflow-foundation` ke `main`, menggunakan [template PR](../.github/PULL_REQUEST_TEMPLATE.md). Judul: `chore: establish M0 workflow foundation and GitHub integration`. Catat otorisasi bootstrap tanpa Issue, SHA aktual, referensi PRD §§3, 9, 11, 13, bukti lokal, serta blocker proteksi/reviewer.
5. Verifikasi default branch main, commit remote sesuai lokal, diff PR, dan run `M0 CI` pada SHA yang tepat. Job yang direncanakan bernama `M0 validation`; konfirmasi nama/status dari run aktual. Hanya feature push/PR yang memiliki workflow; baseline main belum berisi CI.
6. Pertahankan PR sebagai draft selama kontrol merge/reviewer belum siap. Jangan merge, deploy, membuat Issue, atau melanjutkan Fase 5. Persetujuan push tidak berarti persetujuan tindakan tersebut.

Kriteria siap PR: baseline dan head teridentifikasi, diff M0 terbatas, PRD/README asli tetap, validasi lokal lulus, remote resmi terverifikasi, serta risiko/otorisasi publikasi tercatat. URL PR dan run GitHub yang lulus kini tersedia untuk head awal `f2e5512`. Setiap commit berikutnya tetap harus memiliki bukti CI terbaru pada PR yang sama. Proteksi branch dan review independen tetap gate terpisah sebelum merge menurut PRD §§9.5, 11.

Untuk hambatan plan, owner dapat mengevaluasi peningkatan plan yang mendukung proteksi repository private; jangan mengubah visibility menjadi public secara otomatis. Jika menggunakan kontrol setara, mekanisme dan bukti enforceability harus disetujui secara eksplisit terlebih dahulu. Menunggu kontrol ini tidak menghalangi persiapan draft PR, tetapi merge tetap BLOCKED.

### Hasil publikasi dan verifikasi GitHub

Owner menjawab **"oke saya izinkan"** pada 2026-11-24 atas permintaan eksplisit push baseline `main` pada `833603d`, push branch fondasi pada `f2e5512`, pembuatan draft PR, dan verifikasi CI. Persetujuan ini tidak mencakup merge, deployment, perubahan visibility/proteksi, pembuatan Issue, atau Fase 5. Catatan ini merujuk instruksi langsung dalam percakapan, bukan approval review GitHub.

- Remote kembali diperiksa kosong sebelum push. Push membuat dua branch baru tanpa force-push: `main` pada `833603ddc4c126ee70c7549989b49cec5a6442f7` dan `chore/m0-workflow-foundation` pada head awal `f2e5512684e71433dc45717fed5b987d1ef0f81a`. SHA remote cocok dengan lokal; commit `cf440b6`, baseline, dan semua ref lokal tetap dipertahankan. Kedua branch lokal melacak origin masing-masing.
- Default branch GitHub terverifikasi `main`; visibility tetap private. Main masih hanya berisi PRD dan README asli. Fondasi diajukan melalui [draft PR #1](https://github.com/MuhammadZidniirfan05-dot/batani-company/pull/1), base `main`, head `chore/m0-workflow-foundation`; 18 berkas tambahan, tanpa perubahan PRD/README atau penghapusan berkas.
- [CI push 45413815332](https://github.com/MuhammadZidniirfan05-dot/batani-company/actions/runs/45413815332) dan [CI pull_request 45414140487](https://github.com/MuhammadZidniirfan05-dot/batani-company/actions/runs/45414140487) berstatus completed/success pada head awal `f2e5512`. Nama check aktual: **M0 validation**, workflow **M0 CI**. Event pull_request memvalidasi hasil penggabungan sementara GitHub; tidak mengubah main.
- Log run push membuktikan Ubuntu 24.04, Node `24.22.3`, npm `11.19.1`, instalasi lockfile, dan **46/46 pemeriksaan lulus; 0 gagal**. Ini bukti eksekusi GitHub, terpisah dari hasil lokal Windows dengan Node `24.14.1`/npm `11.11.0`. Tidak ada tes Laravel, build frontend, deployment, atau pemanggilan agent.
- API proteksi main dan rulesets diperiksa ulang setelah publikasi: tetap HTTP 403 dengan pesan entitlement plan. PR status `CLEAN` hanya menunjukkan kondisi teknis penggabungan; bukan approval atau bukti proteksi aktif. Review independen belum diberikan. PR tetap draft dan merge BLOCKED sesuai PRD §11.

Bukti untuk commit dokumentasi lanjutan dicatat pada deskripsi/checks PR #1 setelah CI selesai; tautan run di atas tetap menjadi bukti historis bootstrap, bukan klaim tentang SHA yang lebih baru. Template Issue/PR dan instruksi agent sudah ada pada branch PR, tetapi belum menjadi konfigurasi default branch main. Tombol manual workflow juga belum dianggap siap digunakan sebelum workflow tersedia di default branch. Label tambahan, Projects, reviewer berwenang, kontrol merge, dan environment tetap manual/pending; template deployment tetap disabled.

## Peran dan handoff

| Peran | Tugas | Bukti keluar / batas akses |
|---|---|---|
| Planner, model reasoning tinggi | Baca PRD, analisis arsitektur/risiko, pecah pekerjaan dan kontrak Issue | Scope, dependencies, AC, rencana tes; tidak rutin membuat fitur |
| Executor, model coding ekonomis | Baca Issue READY dan aturan; implementasi branch; jalankan pemeriksaan; PR dan rework | Diff/SHA, hasil aktual, keterbatasan; tanpa production credentials |
| Reviewer, model reasoning tinggi | Baca Issue, diff, CI, keamanan dan regresi pada SHA terbaru | APPROVED / CHANGES_REQUESTED / BLOCKED; tidak mengarang bukti |
| Human Owner | Putuskan perubahan kebutuhan/arsitektur/risiko, akses dan release | Persetujuan tercatat; production approval selalu terpisah |

Planner, Executor, dan Reviewer wajib agent/sesi berbeda. Handoff mencatat ID setiap sesi, ID model aktual dan reasoning jika tersedia, serta dasar pemilihan model Reviewer pada tingkat reasoning/kelas biaya lebih tinggi daripada Executor. Pemisahan sesi saja tidak membuktikan perbedaan model atau biaya. Review penerimaan memerlukan bukti model, reasoning, dan sesi aktual yang sesuai dengan pilihan owner; jangan membuat bukti model atau biaya palsu.

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
| APPROVED → MERGED | Owner/maintainer dengan merge permission | CI dan status `Agent review` tepercaya lulus pada head/base terbaru, proteksi aktif; persetujuan risiko/merge yang relevan tersedia |
| MERGED → STAGING | Operator rilis yang ditunjuk owner | Deploy staging aktual, artefak/SHA dan hasil verifikasi |
| STAGING → PRODUCTION_APPROVAL | Operator/owner | UAT, backup dan rollback siap; permintaan persetujuan artefak tertentu |
| PRODUCTION_APPROVAL → DEPLOYED | Owner menyetujui; operator menjalankan | Approval manusia dan bukti deploy/health check aktual |
| DEPLOYED → DONE | Owner/maintainer | Verifikasi pascarilis, dokumentasi, temuan tuntas |
| Status mana pun → BLOCKED | Penanggung jawab melaporkan; owner/maintainer mencatat | Alasan, status asal, pihak pembuka hambatan, dan bukti yang kurang |
| BLOCKED → status asal yang masih valid | Owner/maintainer bersama pihak terkait | Bukti hambatan selesai; evaluasi ulang approval/CI jika SHA berubah |

Untuk dokumentasi tanpa artefak deployment, aturan closure belum ditentukan PRD. Jangan memalsukan STAGING/DEPLOYED. Usulan shortcut MERGED → DONE memerlukan keputusan owner tercatat; sebelum itu tandai gate tersebut N/A-pending-decision dan simpan status terakhir yang valid. Ini bukan perubahan state machine secara sepihak.

## CI dan review

[CI](../.github/workflows/ci.yml) bernama `M0 CI`, dengan nama check yang direncanakan `M0 validation`. Trigger: push pada branch yang tercantum, PR ke main, dan manual dispatch. Tidak memakai path filter agar required check tidak hilang ketika berkas lain berubah. Tidak ada `pull_request_target`, akses secret, atau token tulis. Checkout tidak menyimpan kredensial Git. Action dikunci SHA; dependensi validator dikunci lockfile.

CI menjalankan Node untuk validasi dokumen/YAML/form/PR/template deployment yang memang ada, bukan PHP, Laravel, migrasi, atau build frontend. [Validator](../.github/validation/validate.mjs) juga bisa dijalankan lokal dengan perintah [AGENTS](../AGENTS.md). Kelulusan tidak membuktikan seluruh schema GitHub, keamanan menyeluruh, kebenaran isi Issue, maupun integrasi agent. Uji GitHub pertama sudah lulus sebagaimana bukti di atas; required-check enforcement masih belum aktif.

CI gagal → Executor memperbaiki; CI tidak tersedia → BLOCKED untuk approval final. CI lulus → Reviewer terpisah memeriksa acceptance criteria. CHANGES_REQUESTED wajib menyertakan finding, file/lokasi, severity, alasan, koreksi, verifikasi, dan prompt siap salin untuk Executor; gunakan [REVIEW-CHECKLIST](REVIEW-CHECKLIST.md). Executor memperbaiki PR yang sama dan meminta review atas head terbaru. Komentar AI tidak menggantikan status review yang diverifikasi atau persetujuan manusia untuk risiko/rilis.

### Publisher hasil review tepercaya — rancangan

Owner atau broker tepercaya menyimpan kredensial penulis status. Lingkungan Executor tidak menerima kredensial status/admin/production. Pemisahan ini memerlukan kontrol lingkungan dan izin yang nyata; instruksi tertulis saja belum menjamin pemisahan.

Publisher menerima hasil Reviewer dari sesi terpisah, memverifikasi identitas peran/model, lalu mencocokkan repository, nomor/URL PR, head SHA, base SHA, dan hasil CI aktual. Hasil hanya berlaku selama pasangan head/base tersebut masih berlaku.

| Hasil yang diverifikasi | Status `Agent review` |
|---|---|
| APPROVED dan CI lulus untuk perubahan yang masih berlaku | `success` |
| CHANGES_REQUESTED | `failure` |
| Review berjalan atau bukti sementara belum lengkap | `pending` |
| BLOCKED atau verifikasi definitif gagal | `error` atau `pending`, selalu menahan merge |

Status hilang juga menahan merge bila konteks sudah diwajibkan. Perubahan head/base atau invalidasi CI harus membatalkan kelulusan sebelumnya dan memicu pemeriksaan ulang. Publisher harus mencegah pemalsuan, replay hasil lama, dan penerbitan success untuk commit yang berubah saat diproses. Pengujian harus mencakup kondisi gagal/hilang/usang/tidak tepercaya dan keterkaitan status dengan SHA yang dinilai GitHub sebelum merge. Belum ada implementasi atau pengujian mekanisme tersebut.

Status commit dapat diterbitkan oleh identitas pengguna yang berwenang; akun GitHub kedua atau GitHub App bukan satu-satunya solusi. Kredensial dengan akses tulis dapat menerbitkan status, sehingga distribusi kredensial menjadi batas kepercayaan. GitHub App dengan pengikatan sumber merupakan opsi penguatan; API pembuatan Check Run berbeda dan memerlukan GitHub App. Sumber: [commit statuses](https://docs.github.com/en/rest/commits/statuses), [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [check runs](https://docs.github.com/en/rest/checks/runs).

Tidak dibuat workflow yang selalu hijau atau status fiktif untuk memenuhi nama check. Selama publisher dan proteksi belum aktif, verifikasi masih manual dan merge tetap tertahan menurut PRD §11. Implementasi dan aktivasi memerlukan scope/otorisasi tersendiri; merge, deploy, dan Fase 5 belum diizinkan.

## Konfigurasi GitHub oleh admin, belum diterapkan

### Izin dan branch protection

1. Verifikasi pemilik, visibility, plan, akses admin repository, izin Actions, serta kebijakan organisasi. Projects membutuhkan akses tersendiri; scope token saat inspeksi tidak membuktikan akses itu.
2. Setelah baseline main tersedia, buat PR fondasi dan jalankan CI. Ambil nama check yang benar dari run aktual; pilih `M0 validation` dari aplikasi GitHub Actions. Jangan mewajibkan check Laravel/build yang belum ada.
3. Terapkan rancangan pada tabel proteksi setelah izin owner: wajib PR, native approval count 0, required CI dan `Agent review`, percakapan selesai, serta branch mengikuti base terbaru. Selesaikan integrasi/pengujian publisher sebelum menyebut gate operasional. Perubahan berisiko tetap memerlukan keputusan owner tertulis.
4. Terapkan aturan termasuk admin tanpa bypass agent. Larang force-push/deletion main. Jangan menghapus gate review karena penerbit status belum siap; catat kondisi pending/BLOCKED.
5. Satu akun GitHub diterima. Gunakan hasil dari Reviewer agent terpisah dan publisher tepercaya; self-approval native atau komentar yang belum diverifikasi tidak memenuhi gate. Pisahkan kelayakan merge dari kendali produksi.

Branch protection pada repository private memerlukan plan yang mendukung. Jika kontrol tidak tersedia, jangan mengklaim PR aman untuk merge menurut PRD §11; catat BLOCKED dan minta keputusan owner tentang plan atau mekanisme setara. Panduan: [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

Langkah berikut sesuai PRD §§9.1, 9.5, 11 adalah menerapkan pilihan model/peran pada sesi terpisah dan mencatat bukti setiap run, menyiapkan publisher dan isolasi izin, memverifikasi gate, lalu mengaktifkan aturan dengan izin owner. Undangan akun GitHub kedua tidak lagi diwajibkan. HTTP 403 pada 2026-11-24 adalah bukti historis; setelah owner mengubah visibility menjadi public, proteksi masih belum dikonfigurasi. Tidak ada pengaturan GitHub yang diubah dalam penyelarasan kebijakan ini.

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

Belum ada GitHub App, webhook, pemanggilan model dari workflow repository, dispatcher, maupun reviewer bot. Sebelum menyebut alur otomatis: gunakan identitas/model yang disepakati, catat bukti aktual, dan tentukan budget, scope API minimal (contents/PR/Issues hanya sesuai tugas, Projects bila perlu), pengelolaan secret, sandbox terpisah, timeout/retry, idempotensi agar tidak membuat Issue/PR duplikat, dan log audit yang sudah diredaksi. Jangan memberikan administrasi repository atau production credential kepada Executor.

Bukti penerimaan nanti: satu Issue nyata yang diizinkan owner menghasilkan branch/PR, CI pada SHA yang benar, review, satu koreksi pada PR yang sama, lalu review ulang. Catat siapa menjalankan tiap langkah, izin, hasil, dan biaya. Tidak perlu deployment untuk membuktikan loop pengembangan tersebut; release tetap gate terpisah. Backlog usulan ada di [ROADMAP](ROADMAP.md); Fase 5 belum diizinkan.
