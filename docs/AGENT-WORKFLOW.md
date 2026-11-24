# Runbook GitHub dan alur agent

Acuan: [PRD](PRD.md) §§2, 9, 11–13; [AGENTS](../AGENTS.md). Tanggal inspeksi: 2026-11-24. Status: konfigurasi fondasi lokal; integrasi agent dan GitHub belum terbukti operasional.

## Status repository dan bootstrap

Saat inspeksi, folder hanya berisi [PRD](PRD.md) dan [README](../README.md), belum menjadi repository Git. Fase 3–4 menginisialisasi repository lokal pada branch `chore/m0-workflow-foundation`; commit awal `833603d` menyimpan dua dokumen asli. Belum ada branch `main`, remote, push, PR, atau Issue baru.

GitHub CLI terautentikasi sebagai `MuhammadZidniirfan05-dot`. Lookup repository contoh `MuhammadZidniirfan05-dot/company-profile-cms` tidak dapat di-resolve; bukan bukti bahwa repository tidak ada di semua akun. API user mengembalikan plan `null`; tidak dapat disimpulkan Free atau paid. Izin admin, Projects, Actions, environment, dan model runner belum diverifikasi. Token login lokal bukan token yang boleh diteruskan ke agent/CI.

Untuk melanjutkan setelah owner menerima paket ini: pastikan repository tujuan baru yang terpisah sesuai PRD §13, nama/visibility dan izin owner. Remote hanya ditambahkan ke URL yang diverifikasi. Jika remote masih kosong, owner/maintainer dapat menyiapkan `main` dari commit baseline saja, lalu mengajukan perubahan fondasi lewat feature PR. Jika remote sudah memiliki riwayat, fetch dan tinjau riwayat lebih dahulu; jangan force-push atau mengganti main dengan riwayat lokal. Transfer perubahan ke branch dari baseline remote yang benar. Tidak ada langkah tersebut yang dijalankan pada fase ini.

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
