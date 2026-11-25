import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateReview, parseSimulationJSON, transitionLifecycle, STATES } from '../policy.mjs';
import { fixture, changes, lifecycleState, command } from '../fixtures.mjs';

function rejection(change, reason) {
  const data = fixture();
  change(data.request, data.context);
  const output = evaluateReview(data.request, data.context);
  assert.equal(output.decision, 'HOLD');
  assert.ok(output.reasonCodes.includes(reason), JSON.stringify(output));
  assert.equal(output.simulationOnly, true);
  assert.equal(output.nativeGateVerified, false);
  assert.equal(output.syntheticPublicationPlan, undefined);
}
test('F1-01: complete synthetic approval produces only a local plan and does not mutate inputs', () => {
  const data = fixture();
  const before = structuredClone(data);
  const output = evaluateReview(data.request, data.context);
  assert.equal(output.decision, 'READY_TO_PUBLISH');
  assert.equal(output.nativeGateVerified, false);
  assert.equal(output.simulationOnly, true);
  assert.deepEqual(output.syntheticPublicationPlan.target, data.context.target);
  assert.deepEqual(output.syntheticPublicationPlan.ci, data.context.currentCI);
  assert.deepEqual(data, before);
});
test('F1-02: all unsuccessful or unfinished CI outcomes fail closed', () => {
  for (const conclusion of ['failure', 'skipped', 'neutral', 'cancelled', 'timed_out',
    'action_required', 'stale', 'startup_failure', null]) {
    rejection((request, context) => {
      request.ci.conclusion = conclusion;
      context.currentCI.conclusion = conclusion;
    }, 'CI_NOT_SUCCESS');
  }
  for (const status of ['queued', 'in_progress']) {
    rejection((request, context) => {
      request.ci.status = status;
      context.currentCI.status = status;
    }, 'CI_NOT_SUCCESS');
  }
  rejection((request, context) => { request.ci = null; context.currentCI = null; }, 'CI_MISSING');
  rejection((request) => { request.ci = null; }, 'CI_MISSING');
  assert.equal(evaluateReview(null, fixture().context).decision, 'HOLD');
});
test('F1-03: changes require complete findings and a correction prompt; blocked cannot approve', () => {
  const { request, context } = fixture();
  const rejected = changes(request);
  assert.equal(evaluateReview(rejected, context).reasonCodes[0], 'REVIEW_CHANGES_REQUESTED');
  const absentCI = structuredClone(context);
  absentCI.currentCI = null;
  rejected.ci = null;
  assert.equal(evaluateReview(rejected, absentCI).reasonCodes[0], 'REVIEW_CHANGES_REQUESTED');
  for (const field of ['severity', 'location', 'reason', 'fix', 'verify']) {
    const incomplete = changes(request);
    delete incomplete.findings[0][field];
    assert.equal(evaluateReview(incomplete, context).reasonCodes[0], 'INVALID_REQUEST');
  }
  rejection((value) => Object.assign(value, changes(value), { correctionPrompt: '' }), 'INCOMPLETE_REVIEW');
  rejection((value) => Object.assign(value, changes(value), { findings: [] }), 'INCOMPLETE_REVIEW');
  rejection((value) => {
    Object.assign(value, changes(value));
    value.findings.push(structuredClone(value.findings[0]));
  }, 'INCOMPLETE_REVIEW');
  rejection((value) => { value.allAcceptanceCriteria = false; }, 'INCOMPLETE_REVIEW');
  rejection((value) => { value.verdict = 'BLOCKED'; }, 'REVIEW_BLOCKED');
});
test('F1-04: repo, PR, head, base, merge and every scope fingerprint bind the review', () => {
  for (const key of Object.keys(fixture().context.target)) {
    rejection((request, context) => {
      context.target[key] = key === 'repo' ? 'synthetic/other'
        : key === 'pr' ? 124
          : 'f'.repeat(['head', 'base', 'merge'].includes(key) ? 40 : 64);
    }, 'TARGET_CHANGED');
  }
  rejection((request, context) => { context.assignment.epoch++; }, 'ASSIGNMENT_CHANGED');
  rejection((request, context) => { context.assignment.id = 'another-assignment'; }, 'ASSIGNMENT_CHANGED');
});
test('F1-05: CI source must match independently supplied policy', () => {
  const replacements = {
    appId: 999, workflowId: 999, path: '.github/workflows/other.yml',
    digest: '8'.repeat(64), event: 'push',
  };
  for (const [key, value] of Object.entries(replacements)) {
    rejection((request, context) => {
      request.ci[key] = value;
      context.currentCI[key] = value;
    }, 'CI_SOURCE_UNTRUSTED');
  }
  rejection((request) => { request.ci.appId = 999; }, 'CI_CHANGED');
  rejection((request, context) => { context.sourceTrusted = false; }, 'SOURCE_UNTRUSTED');
});
test('F1-06: independent reviewer, known metadata and owner-selected models are required', () => {
  for (const name of ['planner', 'worker']) {
    rejection((request, context) => {
      context.registry.reviewer.sessionId = context.registry[name].sessionId;
      request.roles.reviewer.sessionId = request.roles[name].sessionId;
    }, 'ROLE_SESSION_COLLISION');
  }
  rejection((request, context) => { context.registry.reviewer.metadataKnown = false; }, 'METADATA_UNKNOWN');
  rejection((request, context) => { context.registry.worker.model = 'unknown'; }, 'ROLE_CONFIGURATION');
  rejection((request, context) => { context.registry.reviewer.reasoning = 'medium'; }, 'ROLE_CONFIGURATION');
  rejection((request) => { request.roles.reviewer.metadataRef = 'syn:unregistered'; }, 'ROLE_REGISTRY_MISMATCH');
  const { request, context } = fixture();
  request.assignment.kind = context.assignment.kind = 'application';
  for (const role of [request.roles.worker, context.registry.worker]) {
    role.model = 'gpt-6.1-sol'; role.reasoning = 'medium';
  }
  assert.equal(evaluateReview(request, context).decision, 'READY_TO_PUBLISH');
});

test('F1-27: Planner and Worker may share a chat with separate stage metadata', () => {
  for (const kind of ['workflow', 'application']) {
    const data = fixture();
    const { request, context } = data;
    request.assignment.kind = context.assignment.kind = kind;
    for (const roles of [request.roles, context.registry]) {
      roles.worker.sessionId = roles.planner.sessionId;
      if (kind === 'application') {
        roles.worker.model = 'gpt-6.1-sol';
        roles.worker.reasoning = 'medium';
      }
    }
    const before = structuredClone(data);
    const output = evaluateReview(request, context);
    assert.equal(output.decision, 'READY_TO_PUBLISH');
    assert.equal(output.simulationOnly, true);
    assert.equal(output.nativeGateVerified, false);
    assert.deepEqual(data, before);
  }
});

test('F1-28: shared chat does not bypass stage evidence, model policy or the registry', () => {
  for (const scenario of ['run', 'metadata', 'model', 'registry']) {
    const reasons = {
      run: 'ROLE_RUN_COLLISION', metadata: 'METADATA_UNKNOWN',
      model: 'ROLE_CONFIGURATION', registry: 'ROLE_REGISTRY_MISMATCH',
    };
    rejection((request, context) => {
      request.assignment.kind = context.assignment.kind = 'application';
      for (const roles of [request.roles, context.registry]) {
        roles.worker.sessionId = roles.planner.sessionId;
        roles.worker.model = 'gpt-6.1-sol';
        roles.worker.reasoning = 'medium';
      }
      if (scenario === 'run') {
        context.registry.worker.metadataRef = context.registry.planner.metadataRef;
        request.roles.worker.metadataRef = request.roles.planner.metadataRef;
      } else if (scenario === 'metadata') {
        context.registry.worker.metadataKnown = false;
      } else if (scenario === 'model') {
        context.registry.worker.model = 'gpt-6-astra';
        context.registry.worker.reasoning = 'high';
      } else {
        request.roles.worker.metadataRef = 'syn:unregistered-stage';
      }
    }, reasons[scenario]);
  }
});
test('F1-07: synthetic provenance is exact; expiration and future issuance fail closed', () => {
  for (const key of Object.keys(fixture().request.provenance)) {
    rejection((request) => { request.provenance[key] = 'syn:different'; }, 'PROVENANCE_MISMATCH');
  }
  rejection((request, context) => { request.expiresAt = context.now; }, 'REVIEW_TIME_INVALID');
  rejection((request, context) => { request.issuedAt = context.now + 1; }, 'REVIEW_TIME_INVALID');
  rejection((request, context) => {
    request.expiresAt = request.issuedAt + context.reviewPolicy.maxAgeSeconds + 1;
  }, 'REVIEW_TIME_INVALID');
});
test('F1-08: replay is idempotent and a newer rejection supersedes an earlier local plan', () => {
  const { request, context } = fixture();
  const first = evaluateReview(request, context);
  context.replay = first.replayUpdate;
  const duplicate = evaluateReview(request, context);
  assert.equal(duplicate.decision, 'ALREADY_PROCESSED');
  assert.equal(duplicate.syntheticPublicationPlan, undefined);
  const newer = changes(request);
  newer.sequence = 2;
  newer.provenance.reviewId = 'syn:review/2';
  newer.provenance.nonce = 'syn:nonce/2';
  newer.provenance.signatureReceipt = 'syn:receipt/2';
  context.provenance = structuredClone(newer.provenance);
  const denied = evaluateReview(newer, context);
  assert.equal(denied.reasonCodes[0], 'REVIEW_CHANGES_REQUESTED');
  assert.equal(denied.replayUpdate.lastSequence, 2);
  context.replay = denied.replayUpdate;
  context.provenance = structuredClone(request.provenance);
  assert.equal(evaluateReview(request, context).decision, 'ALREADY_PROCESSED');
  rejection((value, current) => { current.replay.lastSequence = 2; }, 'SEQUENCE_STALE');
  const fresh = fixture();
  fresh.context.replay.consumedNonces.push(fresh.request.provenance.nonce);
  assert.equal(evaluateReview(fresh.request, fresh.context).decision, 'ALREADY_PROCESSED');
});
test('F1-09: old CI attempts, runs and tested merge commits cannot approve', () => {
  rejection((request, context) => { context.currentCI.attempt = 2; }, 'CI_CHANGED');
  rejection((request, context) => { context.currentCI.runId++; }, 'CI_CHANGED');
  rejection((request, context) => { context.currentCI.testedMerge = 'd'.repeat(40); }, 'CI_TARGET_CHANGED');
  rejection((request, context) => { context.currentCI.head = 'd'.repeat(40); }, 'CI_TARGET_CHANGED');
});
test('F1-10: ambiguous, closed, draft and conflicting PRs cannot approve', () => {
  for (const [key, value, reason] of [
    ['unique', false, 'PR_AMBIGUOUS'], ['open', false, 'PR_CLOSED'],
    ['draft', true, 'PR_DRAFT'], ['mergeable', 'conflict', 'PR_UNMERGEABLE'],
    ['mergeable', 'unknown', 'PR_UNMERGEABLE'],
  ]) rejection((request, context) => { context.pullRequest[key] = value; }, reason);
});
test('F1-11: JSON, unknown fields, missing fields, prototype keys and size limits are strict', () => {
  assert.throws(() => parseSimulationJSON('{broken'));
  assert.throws(() => parseSimulationJSON(' '.repeat(65_537)));
  assert.throws(() => parseSimulationJSON('{"__proto__":{"polluted":true}}'));
  assert.throws(() => parseSimulationJSON('{"nested":{"constructor":{}}}'));
  rejection((request) => { request.extra = true; }, 'INVALID_REQUEST');
  rejection((request) => { request.roles.reviewer.extra = true; }, 'INVALID_REQUEST');
  rejection((request) => { delete request.target.base; }, 'INVALID_REQUEST');
  rejection((request) => { request.ci.attempt = '1'; }, 'INVALID_REQUEST');
  rejection((request, context) => { context.replay.consumedReviewIds = Array(65).fill('syn:x'); }, 'INVALID_CONTEXT');
  rejection((request) => { request.correctionPrompt = 'x'.repeat(4_097); }, 'INVALID_REQUEST');
  let nested = {};
  for (let index = 0; index < 14; index++) nested = { child: nested };
  assert.throws(() => parseSimulationJSON(JSON.stringify(nested)));
  const parsed = parseSimulationJSON(JSON.stringify(fixture().request));
  assert.equal(evaluateReview(parsed, fixture().context).decision, 'READY_TO_PUBLISH');
});
test('F1-12: accessors and executable values are rejected; finding text is inert data', () => {
  const { request, context } = fixture();
  let called = false;
  Object.defineProperty(request, 'verdict', {
    enumerable: true, get() { called = true; return 'APPROVED'; },
  });
  assert.equal(evaluateReview(request, context).reasonCodes[0], 'INVALID_REQUEST');
  assert.equal(called, false);
  rejection((value) => { value.correctionPrompt = () => 'execute'; }, 'INVALID_REQUEST');
  const inert = changes(fixture().request);
  inert.findings[0].reason = 'throw new Error("executed"); process.env.SECRET; $(whoami)';
  assert.equal(evaluateReview(inert, context).reasonCodes[0], 'REVIEW_CHANGES_REQUESTED');
  rejection((value) => { value.simulation = false; }, 'INVALID_REQUEST');
  rejection((value, current) => { current.simulation = false; }, 'INVALID_CONTEXT');
});

function transitionCases(request) {
  return [
    ['BACKLOG', 'READY', 'owner', { planRef: 'syn:plan', readyRef: 'syn:ready' }],
    ['READY', 'IN_PROGRESS', 'worker', { workRef: 'syn:work' }],
    ['IN_PROGRESS', 'IN_REVIEW', 'worker', { reviewRef: 'syn:review', ciRef: 'syn:ci' }],
    ['IN_REVIEW', 'CHANGES_REQUESTED', 'reviewer', { reviewRef: 'syn:review', reviewRequest: changes(request) }],
    ['CHANGES_REQUESTED', 'IN_PROGRESS', 'worker', { workRef: 'syn:rework' }],
    ['IN_REVIEW', 'APPROVED', 'reviewer', { reviewRef: 'syn:review', ciRef: 'syn:ci', reviewRequest: request }],
    ['APPROVED', 'IN_REVIEW', 'worker', { reviewRef: 'syn:rereview', ciRef: 'syn:ci' }],
    ['APPROVED', 'MERGED', 'owner', { mergeRef: 'syn:merge', gateRef: 'syn:gate', ciRef: 'syn:ci', reviewRequest: request }],
    ['MERGED', 'STAGING', 'owner', { stagingRef: 'syn:staging', backupRef: 'syn:backup', rollbackRef: 'syn:rollback', ciRef: 'syn:ci' }],
    ['STAGING', 'PRODUCTION_APPROVAL', 'owner', { stagingRef: 'syn:staging', approvalRef: 'syn:approval', ciRef: 'syn:ci' }],
    ['PRODUCTION_APPROVAL', 'DEPLOYED', 'owner', { approvalRef: 'syn:approval', deploymentRef: 'syn:deployment', backupRef: 'syn:backup', rollbackRef: 'syn:rollback', ciRef: 'syn:ci' }],
    ['DEPLOYED', 'DONE', 'owner', { acceptanceRef: 'syn:acceptance', ciRef: 'syn:ci' }],
  ];
}
test('F1-13: every configured lifecycle edge requires its actor and evidence', () => {
  const { request, context } = fixture();
  for (const [from, to, actor, evidence] of transitionCases(request)) {
    const state = lifecycleState(context, from);
    const event = command(context, to, actor, evidence);
    const before = structuredClone({ state, event, context });
    const accepted = transitionLifecycle(state, event, context);
    assert.equal(accepted.decision, 'TRANSITION_ALLOWED', `${from}>${to}: ${JSON.stringify(accepted)}`);
    assert.equal(accepted.nextState.state, to);
    assert.equal(accepted.nativeGateVerified, false);
    assert.deepEqual({ state, event, context }, before);
    event.actor = 'planner';
    assert.equal(transitionLifecycle(state, event, context).reasonCodes[0], 'ACTOR_FORBIDDEN');
    event.actor = actor;
    delete event.evidence[Object.keys(evidence)[0]];
    assert.equal(transitionLifecycle(state, event, context).reasonCodes[0], 'EVIDENCE_MISSING');
  }
});
test('F1-14: full synthetic release path and correction loop retain the same PR', () => {
  const { request, context } = fixture();
  const cases = transitionCases(request);
  let state = lifecycleState(context);
  for (const index of [0, 1, 2, 3, 4, 2, 5, 7, 8, 9, 10, 11]) {
    const [, to, actor, evidence] = cases[index];
    const output = transitionLifecycle(state, command(context, to, actor, evidence), context);
    assert.equal(output.decision, 'TRANSITION_ALLOWED');
    state = output.nextState;
    assert.equal(state.target.pr, context.target.pr);
  }
  assert.equal(state.state, 'DONE');
});
test('F1-15: BLOCKED records its origin and recovery requires owner evidence', () => {
  const { request, context } = fixture();
  for (const origin of STATES.filter((state) => !['DONE', 'BLOCKED'].includes(state))) {
    const blocked = transitionLifecycle(lifecycleState(context, origin),
      command(context, 'BLOCKED', 'worker', { blockerRef: 'syn:blocker' }), context);
    assert.equal(blocked.nextState.blockedFrom, origin);
    const recovery = command(context, origin, 'owner', {
      recoveryRef: 'syn:recovery', ciRef: 'syn:ci', gateRef: 'syn:gate', reviewRequest: request,
    });
    assert.equal(transitionLifecycle(blocked.nextState, recovery, context).decision, 'TRANSITION_ALLOWED');
    delete recovery.evidence.recoveryRef;
    assert.equal(transitionLifecycle(blocked.nextState, recovery, context).reasonCodes[0], 'EVIDENCE_MISSING');
    recovery.actor = 'worker';
    assert.equal(transitionLifecycle(blocked.nextState, recovery, context).reasonCodes[0], 'RECOVERY_FORBIDDEN');
  }
});
test('F1-16: stale approval cannot merge or recover; changed head can enter a fresh review', () => {
  const { request, context } = fixture();
  const approved = lifecycleState(context, 'APPROVED');
  context.target.head = context.currentCI.head = 'd'.repeat(40);
  request.target.head = request.ci.head = 'd'.repeat(40);
  const merge = command(context, 'MERGED', 'owner', {
    mergeRef: 'syn:merge', gateRef: 'syn:gate', ciRef: 'syn:ci', reviewRequest: request,
  });
  assert.equal(transitionLifecycle(approved, merge, context).reasonCodes[0], 'SNAPSHOT_STALE');
  const rereview = command(context, 'IN_REVIEW', 'worker', { reviewRef: 'syn:new', ciRef: 'syn:ci' });
  assert.equal(transitionLifecycle(approved, rereview, context).decision, 'TRANSITION_ALLOWED');
  const blocked = transitionLifecycle(approved,
    command(context, 'BLOCKED', 'worker', { blockerRef: 'syn:changed-head' }), context).nextState;
  const recovery = command(context, 'APPROVED', 'owner', {
    recoveryRef: 'syn:recovery', ciRef: 'syn:ci', reviewRequest: request,
  });
  assert.equal(transitionLifecycle(blocked, recovery, context).reasonCodes[0], 'SNAPSHOT_STALE');
});
test('F1-17: lifecycle rejects changed PR, stale evidence, bad CI and absent review', () => {
  const { context } = fixture();
  const state = lifecycleState(context, 'IN_PROGRESS');
  const event = command(context, 'IN_REVIEW', 'worker', { reviewRef: 'syn:review', ciRef: 'syn:ci' });
  event.evidence.binding.attempt++;
  assert.equal(transitionLifecycle(state, event, context).reasonCodes[0], 'EVIDENCE_STALE');
  event.evidence.binding.attempt--;
  context.currentCI.conclusion = 'failure';
  assert.equal(transitionLifecycle(state, event, context).reasonCodes[0], 'CI_NOT_SUCCESS');
  context.currentCI.conclusion = 'success';
  context.target.pr++;
  assert.equal(transitionLifecycle(state, event, context).reasonCodes[0], 'IDENTITY_CHANGED');
  const fresh = fixture();
  const approval = command(fresh.context, 'APPROVED', 'reviewer', { reviewRef: 'syn:review', ciRef: 'syn:ci' });
  assert.equal(transitionLifecycle(lifecycleState(fresh.context, 'IN_REVIEW'),
    approval, fresh.context).reasonCodes[0], 'EVIDENCE_MISSING');
});
test('F1-18: docs-only MERGED to DONE is disabled unless both synthetic conditions hold', () => {
  const { context } = fixture();
  const state = lifecycleState(context, 'MERGED');
  const event = command(context, 'DONE', 'owner', { acceptanceRef: 'syn:acceptance', ciRef: 'syn:ci' });
  assert.equal(transitionLifecycle(state, event, context).reasonCodes[0], 'DOCS_SHORTCUT_DISABLED');
  context.lifecyclePolicy.allowDocsOnlyDone = true;
  context.pullRequest.pureDocs = false;
  assert.equal(transitionLifecycle(state, event, context).reasonCodes[0], 'DOCS_SHORTCUT_DISABLED');
  context.pullRequest.pureDocs = true;
  assert.equal(transitionLifecycle(state, event, context).decision, 'TRANSITION_ALLOWED');
  delete event.evidence.acceptanceRef;
  assert.equal(transitionLifecycle(state, event, context).reasonCodes[0], 'EVIDENCE_MISSING');
});
test('F1-19: illegal lifecycle shortcuts, malformed recovery and terminal blocking are rejected', () => {
  const { context } = fixture();
  assert.equal(transitionLifecycle(lifecycleState(context),
    command(context, 'DEPLOYED', 'owner'), context).reasonCodes[0], 'TRANSITION_FORBIDDEN');
  assert.equal(transitionLifecycle(lifecycleState(context, 'DONE'),
    command(context, 'BLOCKED', 'owner', { blockerRef: 'syn:blocker' }), context).reasonCodes[0], 'TRANSITION_FORBIDDEN');
  assert.equal(transitionLifecycle(lifecycleState(context, 'BLOCKED'),
    command(context, 'READY', 'owner', { recoveryRef: 'syn:recovery' }), context).reasonCodes[0], 'INVALID_LIFECYCLE');
});
test('F1-20: review lifetime follows a strict positive synthetic policy parameter', () => {
  const { request, context } = fixture();
  context.reviewPolicy.maxAgeSeconds = 120;
  request.expiresAt = request.issuedAt + context.reviewPolicy.maxAgeSeconds;
  assert.equal(evaluateReview(request, context).decision, 'READY_TO_PUBLISH');
  request.expiresAt++;
  assert.equal(evaluateReview(request, context).reasonCodes[0], 'REVIEW_TIME_INVALID');
  for (const invalid of [0, -1, 1.5, '120', null, true, 2_147_483_648]) {
    rejection((value, current) => {
      current.reviewPolicy.maxAgeSeconds = invalid;
    }, 'INVALID_CONTEXT');
  }
  rejection((value, current) => { delete current.reviewPolicy; }, 'INVALID_CONTEXT');
  rejection((value, current) => { delete current.reviewPolicy.maxAgeSeconds; }, 'INVALID_CONTEXT');
  rejection((value, current) => { current.reviewPolicy.extra = true; }, 'INVALID_CONTEXT');
});
test('F1-21: status publisher cannot merge; the owner can satisfy the synthetic merge rule', () => {
  const { request, context } = fixture();
  const state = lifecycleState(context, 'APPROVED');
  const event = command(context, 'MERGED', 'publisher', {
    mergeRef: 'syn:merge', gateRef: 'syn:gate', ciRef: 'syn:ci', reviewRequest: request,
  });
  const denied = transitionLifecycle(state, event, context);
  assert.equal(denied.decision, 'HOLD');
  assert.equal(denied.reasonCodes[0], 'ACTOR_FORBIDDEN');
  assert.equal(denied.nextState, undefined);
  event.actor = 'owner';
  assert.equal(transitionLifecycle(state, event, context).decision, 'TRANSITION_ALLOWED');
});
test('F1-22: persisted exact review evidence composes with lifecycle without a new publication', () => {
  const { request, context } = fixture();
  const evaluated = evaluateReview(request, context);
  assert.equal(evaluated.decision, 'READY_TO_PUBLISH');
  context.replay = evaluated.replayUpdate;
  assert.deepEqual(context.replay.latestReview, request);
  assert.notEqual(context.replay.latestReview, request);
  const before = structuredClone(context);
  let state = lifecycleState(context, 'IN_REVIEW');
  for (const [to, actor, evidence] of [
    ['APPROVED', 'reviewer', { reviewRef: 'syn:review', ciRef: 'syn:ci', reviewRequest: request }],
    ['MERGED', 'owner', { mergeRef: 'syn:merge', gateRef: 'syn:gate', ciRef: 'syn:ci', reviewRequest: request }],
  ]) {
    const output = transitionLifecycle(state, command(context, to, actor, evidence), context);
    assert.equal(output.decision, 'TRANSITION_ALLOWED', JSON.stringify(output));
    assert.equal(output.syntheticPublicationPlan, undefined);
    assert.equal(output.replayUpdate, undefined);
    state = output.nextState;
  }
  assert.equal(state.state, 'MERGED');
  assert.deepEqual(context, before);
  const duplicate = evaluateReview(request, context);
  assert.equal(duplicate.decision, 'ALREADY_PROCESSED');
  assert.equal(duplicate.syntheticPublicationPlan, undefined);
  assert.equal(duplicate.replayUpdate, undefined);

  const rework = fixture();
  const rejected = changes(rework.request);
  rework.context.replay = evaluateReview(rejected, rework.context).replayUpdate;
  const checkpoint = structuredClone(rework.context.replay);
  const correction = transitionLifecycle(lifecycleState(rework.context, 'IN_REVIEW'),
    command(rework.context, 'CHANGES_REQUESTED', 'reviewer', {
      reviewRef: 'syn:correction', reviewRequest: rejected,
    }), rework.context);
  assert.equal(correction.decision, 'TRANSITION_ALLOWED');
  assert.equal(correction.replayUpdate, undefined);
  assert.equal(correction.syntheticPublicationPlan, undefined);
  assert.deepEqual(rework.context.replay, checkpoint);
});
test('F1-23: reusable evidence still requires exact payload and every current approval gate', () => {
  const invalidators = [
    ['CI attempt', (request, context) => { context.currentCI.attempt++; }],
    ['CI run', (request, context) => { context.currentCI.runId++; }],
    ['CI source', (request, context) => { context.currentCI.event = 'push'; }],
    ['CI digest', (request, context) => {
      context.currentCI.digest = context.expectedCI.digest = '8'.repeat(64);
    }],
    ['epoch', (request, context) => { context.assignment.epoch++; }],
    ['expiry', (request, context) => { context.now = request.expiresAt; }],
    ['base', (request, context) => { context.target.base = 'd'.repeat(40); }],
    ['policy digest', (request, context) => { context.target.policyDigest = '6'.repeat(64); }],
    ['metadata', (request, context) => { context.registry.reviewer.metadataKnown = false; }],
    ['request payload', (request) => { request.issuedAt--; }],
    ['checkpoint payload', (request, context) => { context.replay.latestReview.issuedAt--; }],
    ['missing checkpoint payload', (request, context) => { context.replay.latestReview = null; }],
    ['latest sequence', (request, context) => { context.replay.lastSequence++; }],
  ];
  for (const [label, invalidate] of invalidators) {
    const { request, context } = fixture();
    context.replay = evaluateReview(request, context).replayUpdate;
    invalidate(request, context);
    // Bind state/event to current context; saved review must pass independently.
    const state = lifecycleState(context, 'IN_REVIEW');
    const event = command(context, 'APPROVED', 'reviewer', {
      reviewRef: 'syn:review', ciRef: 'syn:ci', reviewRequest: request,
    });
    const output = transitionLifecycle(state, event, context);
    assert.equal(output.decision, 'HOLD', label);
    assert.equal(output.nextState, undefined, label);
    assert.equal(output.syntheticPublicationPlan, undefined, label);
  }
});
test('F1-24: a newer authenticated synthetic rejection prevents old approval reuse', () => {
  const { request, context } = fixture();
  context.replay = evaluateReview(request, context).replayUpdate;
  const newer = changes(request);
  newer.sequence++;
  newer.provenance.reviewId = 'syn:review/2';
  newer.provenance.nonce = 'syn:nonce/2';
  newer.provenance.signatureReceipt = 'syn:receipt/2';
  context.provenance = structuredClone(newer.provenance);
  const rejected = evaluateReview(newer, context);
  assert.equal(rejected.reasonCodes[0], 'REVIEW_CHANGES_REQUESTED');
  context.replay = rejected.replayUpdate;
  assert.deepEqual(context.replay.latestReview, newer);
  // Match old provenance to isolate supersession by the newer checkpoint.
  context.provenance = structuredClone(request.provenance);
  const output = transitionLifecycle(lifecycleState(context, 'IN_REVIEW'),
    command(context, 'APPROVED', 'reviewer', {
      reviewRef: 'syn:old-review', ciRef: 'syn:ci', reviewRequest: request,
    }), context);
  assert.equal(output.decision, 'HOLD');
  assert.equal(output.reasonCodes[0], 'REVIEW_EVIDENCE_REJECTED');
  assert.equal(output.nextState, undefined);
  assert.equal(output.syntheticPublicationPlan, undefined);
});
test('F1-25: recovery into review states rejects every ineligible PR condition', () => {
  const invalidPRs = [
    ['unique', false, 'PR_AMBIGUOUS'], ['open', false, 'PR_CLOSED'],
    ['draft', true, 'PR_DRAFT'], ['mergeable', 'conflict', 'PR_UNMERGEABLE'],
    ['mergeable', 'unknown', 'PR_UNMERGEABLE'],
  ];
  for (const origin of ['IN_REVIEW', 'APPROVED', 'CHANGES_REQUESTED']) {
    for (const [key, value, reason] of invalidPRs) {
      const { request, context } = fixture();
      const blocked = transitionLifecycle(lifecycleState(context, origin),
        command(context, 'BLOCKED', 'worker', { blockerRef: 'syn:blocker' }), context);
      assert.equal(blocked.decision, 'TRANSITION_ALLOWED');
      context.pullRequest[key] = value;
      const output = transitionLifecycle(blocked.nextState,
        command(context, origin, 'owner', {
          recoveryRef: 'syn:recovery', ciRef: 'syn:ci', reviewRequest: request,
        }), context);
      assert.equal(output.decision, 'HOLD', `${origin}: ${key}`);
      assert.equal(output.reasonCodes[0], reason, `${origin}: ${key}`);
      assert.equal(output.nextState, undefined);
    }
  }
});
test('F1-26: postmerge recovery does not require a merged PR to remain open', () => {
  for (const origin of ['MERGED', 'STAGING', 'PRODUCTION_APPROVAL', 'DEPLOYED']) {
    const { context } = fixture();
    context.pullRequest.open = false;
    const blocked = transitionLifecycle(lifecycleState(context, origin),
      command(context, 'BLOCKED', 'owner', { blockerRef: 'syn:release-blocker' }), context);
    assert.equal(blocked.decision, 'TRANSITION_ALLOWED');
    const output = transitionLifecycle(blocked.nextState,
      command(context, origin, 'owner', {
        recoveryRef: 'syn:recovery', ciRef: 'syn:ci', gateRef: 'syn:gate',
      }), context);
    assert.equal(output.decision, 'TRANSITION_ALLOWED', origin);
    assert.equal(output.nextState.state, origin);
    assert.equal(output.nextState.blockedFrom, null);
  }
});
