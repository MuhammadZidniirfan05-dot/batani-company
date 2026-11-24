// PRD §§9.3–9.6, 11: pemeriksaan fondasi, bukan tes aplikasi atau audit menyeluruh.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const expectedPrdHash = '74dcb4f05de25976da06cef2d569fcd86e8e0c22b4ebdfb4fef7ebd3aa9bbd33';
const documents = [
  'AGENTS.md', 'docs/ARCHITECTURE.md', 'docs/AGENT-WORKFLOW.md',
  'docs/ROADMAP.md', 'docs/ISSUE-GUIDELINES.md', 'docs/REVIEW-CHECKLIST.md',
  'docs/PHP-COMPATIBILITY.md',
];
const requiredFiles = [
  'README.md', 'docs/PRD.md', ...documents, '.gitignore',
  '.github/PULL_REQUEST_TEMPLATE.md',
  ...['feature', 'bug', 'chore'].map((kind) => `.github/ISSUE_TEMPLATE/${kind}.yml`),
  ...['ci', 'deploy-staging', 'deploy-production'].map((name) => `.github/workflows/${name}.yml`),
  '.github/validation/package.json', '.github/validation/package-lock.json',
  '.github/validation/validate.mjs',
];
const issueFields = [
  'prd', 'business_value', 'technical_objectives', 'scope', 'out_of_scope',
  'dependencies', 'components', 'acceptance_criteria', 'tests',
  'security_risks', 'priority', 'risk', 'agent_owner', 'definition_of_done',
];

function requireThat(condition, message) {
  if (!condition) throw new Error(message);
}

export function parseYaml(source) {
  const document = parseDocument(source, { version: '1.2', uniqueKeys: true });
  requireThat(document.errors.length === 0, document.errors.map((error) => error.message).join('; '));
  requireThat(document.warnings.length === 0, document.warnings.map((warning) => warning.message).join('; '));
  const value = document.toJS({ maxAliasCount: 50 });
  requireThat(value && typeof value === 'object' && !Array.isArray(value), 'YAML harus berisi mapping');
  return value;
}

export function validateIssue(form, kind) {
  requireThat(typeof form.name === 'string' && form.name.trim(), 'Nama form wajib');
  requireThat(typeof form.description === 'string' && form.description.trim(), 'Deskripsi form wajib');
  requireThat(typeof form.title === 'string' && form.title.includes(kind), 'Prefix judul tidak sesuai tipe');
  requireThat(Array.isArray(form.labels) && form.labels.includes(kind), 'Label tipe wajib');
  requireThat(Array.isArray(form.body), 'Body form harus array');
  const fields = new Map();
  for (const field of form.body) {
    requireThat(['markdown', 'input', 'textarea', 'dropdown', 'checkboxes'].includes(field.type), 'Tipe field tidak didukung validator M0');
    requireThat(field.attributes && typeof field.attributes === 'object', 'Attributes field wajib');
    if (field.type === 'markdown') {
      requireThat(typeof field.attributes.value === 'string', 'Markdown field membutuhkan value');
      continue;
    }
    requireThat(typeof field.id === 'string' && /^[a-z][a-z0-9_-]*$/.test(field.id), 'ID field tidak valid');
    requireThat(!fields.has(field.id), `ID field duplikat: ${field.id}`);
    fields.set(field.id, field);
    requireThat(typeof field.attributes.label === 'string', `Label field ${field.id} wajib`);
    if (['dropdown', 'checkboxes'].includes(field.type)) {
      requireThat(Array.isArray(field.attributes.options) && field.attributes.options.length > 0, `Options ${field.id} wajib`);
    }
  }
  const extras = kind === 'bug' ? ['reproduction', 'expected_actual', 'environment'] : kind === 'chore' ? ['rationale'] : [];
  for (const id of [...issueFields, ...extras]) {
    requireThat(fields.get(id)?.validations?.required === true, `Field ${id} harus wajib`);
  }
  requireThat(JSON.stringify(fields.get('prd')).includes('docs/PRD.md'), 'Field referensi harus menyebut PRD');
  requireThat(fields.get('acceptance_criteria').type === 'textarea', 'AC harus berupa textarea');
}

export function validateWorkflow(workflow, deployment = false) {
  requireThat(typeof workflow.name === 'string', 'Nama workflow wajib');
  requireThat(workflow.on && typeof workflow.on === 'object', 'Trigger YAML 1.2 wajib');
  requireThat(!('pull_request_target' in workflow.on), 'pull_request_target dilarang dalam fondasi M0');
  requireThat(workflow.jobs && Object.keys(workflow.jobs).length > 0, 'Workflow harus memiliki job');
  if (deployment) {
    requireThat(JSON.stringify(Object.keys(workflow.on)) === JSON.stringify(['workflow_dispatch']), 'Template deploy hanya boleh manual dispatch');
    requireThat(JSON.stringify(workflow.permissions) === '{}', 'Template deploy tidak boleh memiliki izin token');
    requireThat(Object.keys(workflow.jobs).length === 1 && workflow.jobs.disabled, 'Template deploy hanya boleh memiliki job disabled');
  } else {
    requireThat(JSON.stringify(workflow.permissions) === JSON.stringify({ contents: 'read' }), 'CI harus memakai contents: read saja');
    requireThat(workflow.on.pull_request?.branches?.includes('main'), 'CI PR harus mencakup main');
    requireThat(workflow.on.push && 'workflow_dispatch' in workflow.on, 'Trigger push/manual wajib');
    requireThat(Object.keys(workflow.jobs).length === 1, 'M0 hanya mempunyai satu job validasi');
    requireThat(workflow.jobs.validate?.name === 'M0 validation', 'Nama required check tidak sesuai runbook');
    requireThat(!workflow.jobs.validate.if && !workflow.jobs.validate['continue-on-error'], 'Required job tidak boleh dilewati/diabaikan');
    for (const event of ['push', 'pull_request']) {
      requireThat(!workflow.on[event].paths && !workflow.on[event]['paths-ignore'], 'Path filter dapat menghilangkan required check');
    }
  }
  requireThat(!JSON.stringify(workflow).includes('secrets.'), 'M0 tidak boleh mengambil secrets');
  for (const job of Object.values(workflow.jobs)) {
    requireThat(job['runs-on'] === 'ubuntu-24.04', 'Runner M0 harus ubuntu-24.04');
    requireThat(Number.isInteger(job['timeout-minutes']) && job['timeout-minutes'] <= 10, 'Timeout job wajib dan maksimal 10 menit');
    requireThat(!job.environment && !job.permissions && !job.uses, 'Job M0 tidak boleh mengikat environment, menambah izin, atau memanggil reusable workflow');
    requireThat(Array.isArray(job.steps) && job.steps.length > 0, 'Steps wajib');
    if (deployment) {
      requireThat(job.if === '${{ false }}', 'Template deployment harus selalu disabled');
      requireThat(job.steps.length === 1 && !job.steps[0].uses, 'Template deployment tidak boleh menjalankan action');
      requireThat(job.steps[0].run === 'echo "Tidak ada deployment. Baca docs/AGENT-WORKFLOW.md."', 'Template deployment hanya boleh berisi pesan inert');
    }
    for (const step of job.steps) {
      if (step.uses) {
        requireThat(/^actions\/(checkout|setup-node)@[a-f0-9]{40}$/.test(step.uses), 'Action harus dikunci SHA 40 karakter dan sesuai allowlist M0');
        if (step.uses.startsWith('actions/checkout@')) {
          requireThat(step.with?.['persist-credentials'] === false, 'Checkout tidak boleh menyimpan kredensial');
        }
      }
      if (step.run) {
        requireThat(!step.run.includes('${{'), 'Jangan interpolasi ekspresi GitHub ke shell M0');
        requireThat(!/artisan|composer\s+(install|update)|npm\s+run\s+build/.test(step.run), 'CI M0 tidak menjalankan aplikasi yang belum ada');
      }
    }
  }
  if (!deployment) {
    const steps = workflow.jobs.validate.steps;
    requireThat(steps.some((step) => step.uses?.startsWith('actions/checkout@')), 'Checkout wajib');
    requireThat(steps.some((step) => step.uses?.startsWith('actions/setup-node@') && step.with?.['node-version'] === '24'), 'Node 24 wajib untuk validator');
    requireThat(steps.some((step) => step.run === 'npm ci --prefix .github/validation --ignore-scripts --no-audit --no-fund'), 'Install validator dari lockfile wajib');
    requireThat(steps.some((step) => step.run === 'node .github/validation/validate.mjs'), 'Validator wajib dijalankan');
  }
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (['.git', 'node_modules'].includes(entry.name)) return [];
    const path = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) return [];
    return entry.isDirectory() ? walk(path) : [path];
  });
}

export function validateLinks(source, file, base = root) {
  // Pemeriksaan target berkas; anchor dan URL eksternal tidak diperiksa lewat jaringan.
  for (const match of source.matchAll(/\[[^\]\n]+\]\(([^)\n]+)\)/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const target = resolve(dirname(file), decodeURIComponent(href.split('#')[0]));
    requireThat(target === base || target.startsWith(base + sep), `Tautan keluar repository: ${href}`);
    requireThat(existsSync(target), `Tautan lokal tidak ditemukan: ${href}`);
  }
}

export function main() {
  let failures = 0;
  let checks = 0;
  function check(name, callback) {
    checks++;
    try { callback(); console.log(`PASS ${name}`); }
    catch (error) { failures++; console.error(`FAIL ${name}: ${error.message}`); }
  }
  for (const file of requiredFiles) {
    check(`required ${file}`, () => requireThat(existsSync(resolve(root, file)) && statSync(resolve(root, file)).size > 0, 'Berkas wajib hilang/kosong'));
  }
  check('PRD baseline unchanged (normalized LF)', () => {
    const content = readFileSync(resolve(root, 'docs/PRD.md'), 'utf8').replace(/\r\n/g, '\n');
    requireThat(createHash('sha256').update(content).digest('hex') === expectedPrdHash, 'PRD berubah; baseline approved tidak boleh ditulis ulang');
  });
  for (const file of documents) {
    check(`PRD reference ${file}`, () => requireThat(readFileSync(resolve(root, file), 'utf8').includes('PRD.md'), 'Dokumen harus merujuk PRD'));
  }
  for (const path of walk(root)) {
    const file = relative(root, path).split(sep).join('/');
    if (/\.ya?ml$/.test(file)) {
      check(`YAML and contract ${file}`, () => {
        const yaml = parseYaml(readFileSync(path, 'utf8'));
        if (file.startsWith('.github/ISSUE_TEMPLATE/')) validateIssue(yaml, file.split('/').at(-1).replace(/\.ya?ml$/, ''));
        if (file.startsWith('.github/workflows/')) validateWorkflow(yaml, file.includes('/deploy-'));
      });
    }
    if (file.endsWith('.md')) check(`local links ${file}`, () => validateLinks(readFileSync(path, 'utf8'), path));
    if (/(^|\/)\.env($|\.)/.test(file) && !file.endsWith('.env.example') || /\.(pem|key|p12|pfx)$/.test(file) || /(^|\/)auth\.json$/.test(file)) {
      check(`sensitive filename ${file}`, () => requireThat(false, 'Berkas kredensial tidak boleh berada di paket M0'));
    }
  }
  check('PR template sections', () => {
    const template = readFileSync(resolve(root, '.github/PULL_REQUEST_TEMPLATE.md'), 'utf8');
    for (const title of ['Issue dan referensi PRD', 'Ringkasan implementasi', 'Berkas yang berubah', 'Acceptance criteria dan bukti', 'Pengujian aktual', 'Dampak data dan migrasi', 'Keamanan', 'Keterbatasan dan keputusan owner', 'Respons atas review sebelumnya', 'Checklist reviewer']) {
      requireThat(template.includes(`## ${title}`), `Bagian PR hilang: ${title}`);
    }
  });
  check('validation package and lock agree', () => {
    const manifest = JSON.parse(readFileSync(resolve(root, '.github/validation/package.json'), 'utf8'));
    const lock = JSON.parse(readFileSync(resolve(root, '.github/validation/package-lock.json'), 'utf8'));
    requireThat(manifest.private === true, 'Tooling tidak boleh dipublikasikan');
    requireThat(lock.packages?.['']?.devDependencies?.yaml === manifest.devDependencies.yaml, 'Versi YAML manifest/lock tidak sama');
    requireThat(lock.packages?.['node_modules/yaml']?.integrity?.startsWith('sha512-'), 'Integrity dependency tidak tersedia');
  });
  console.log(`\nM0 validation: ${checks - failures}/${checks} passed; ${failures} failed.`);
  console.log('Tidak menjalankan tes Laravel, build frontend, deployment, atau integrasi agent.');
  return failures === 0 ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main();
}
