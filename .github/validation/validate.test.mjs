import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { parseYaml, sourceFiles, validateWorkflow } from './validate.mjs';

test('source selection excludes ignored local data but retains a force-added sensitive file', () => {
  const directory = mkdtempSync(join(tmpdir(), 'batani-validator-'));
  try {
    execFileSync('git', ['init', '--quiet', directory]);
    writeFileSync(join(directory, '.gitignore'), '.env\nvendor/\n');
    writeFileSync(join(directory, '.env'), 'NON_SECRET_SYNTHETIC_FIXTURE=1\n');
    mkdirSync(join(directory, 'vendor'));
    writeFileSync(join(directory, 'vendor', 'README.md'), '[ignored](missing.md)');
    writeFileSync(join(directory, 'README.md'), 'Source document');
    assert.ok(sourceFiles(directory).includes(join(directory, 'README.md')));
    assert.ok(!sourceFiles(directory).includes(join(directory, '.env')));
    assert.ok(!sourceFiles(directory).includes(join(directory, 'vendor', 'README.md')));
    execFileSync('git', ['-C', directory, 'add', '--force', '.env']);
    assert.ok(sourceFiles(directory).includes(join(directory, '.env')));
  } finally {
    assert.ok(resolve(directory).startsWith(resolve(tmpdir()) + sep));
    rmSync(directory, { recursive: true, force: true });
  }
});

const workflow = () => parseYaml(readFileSync(new URL('../workflows/application.yml', import.meta.url), 'utf8'));

test('application CI is allowed only with pinned actions, exact PHP and mandatory checks', () => {
  validateWorkflow(workflow(), false, true);
  for (const mutate of [
    (value) => { value.permissions.contents = 'write'; },
    (value) => { value.on.pull_request_target = {}; },
    (value) => { value.jobs.application.steps[0].uses = 'actions/checkout@v4'; },
    (value) => { value.jobs.application.container.image = 'php:8.5.12-cli-bookworm'; },
    (value) => { value.jobs.application.container.image = value.jobs.application.container.image.replace('8.5.12', '8.5.13'); },
    (value) => { value.jobs.application.steps = value.jobs.application.steps.filter((step) => step.run !== 'php artisan test'); },
    (value) => { value.jobs.application.steps.find((step) => step.run === 'php artisan test').if = '${{ false }}'; },
    (value) => { value.jobs.application.steps.find((step) => step.run === 'php artisan test').if = false; },
    (value) => { value.jobs.application.if = false; },
    (value) => { value.jobs.application.steps[3]['continue-on-error'] = true; },
    (value) => { value.jobs.application.steps.find((step) => step.run === 'php artisan test').run += ' || true'; },
    (value) => { value.jobs.application.steps.find((step) => step.run === 'php artisan test').run = 'if false; then\nphp artisan test\nfi'; },
    (value) => { value.jobs.application.steps.find((step) => step.run === 'php artisan test').run += ' --filter DoesNotExist'; },
    (value) => { value.jobs.application.steps.find((step) => step.run === 'php artisan test').shell = 'bash {0}'; },
    (value) => { value.jobs.application.steps = value.jobs.application.steps.filter((step) => !step.run?.includes('PHP_VERSION')); },
  ]) {
    const changed = workflow();
    mutate(changed);
    assert.throws(() => validateWorkflow(changed, false, true));
  }
});

test('allowing application CI does not allow unpinned actions or application commands in M0 CI', () => {
  const m0 = parseYaml(readFileSync(new URL('../workflows/ci.yml', import.meta.url), 'utf8'));
  validateWorkflow(m0);
  m0.jobs.validate.steps.push({ run: 'php artisan test' });
  assert.throws(() => validateWorkflow(m0));
});
