// Offline simulator. No cryptographic verification, publication, or external I/O.
const MAX_BYTES = 65_536;
const encoder = new TextEncoder();
const fail = () => { throw new TypeError('Invalid simulation data'); };
const optional = (check) => Object.assign(
  (value) => { if (value !== undefined) check(value); },
  { optional: true },
);
const enumeration = (...values) => (value) => {
  if (!values.includes(value)) fail();
};
const string = (min, max, pattern) => (value) => {
  if (typeof value !== 'string' || value.length < min || value.length > max
    || (min > 0 && !value.trim()) || (pattern && !pattern.test(value))) fail();
};
const integer = (min, max) => (value) => {
  if (!Number.isSafeInteger(value) || value < min || value > max) fail();
};
const array = (check, max = 64) => (value) => {
  if (!Array.isArray(value) || value.length > max) fail();
  value.forEach(check);
};
const record = (fields) => (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail();
  if (Object.keys(value).some((key) => !Object.hasOwn(fields, key))) fail();
  for (const [key, check] of Object.entries(fields)) {
    if (!Object.hasOwn(value, key) && !check.optional) fail();
    check(value[key]);
  }
};
const nullable = (check) => (value) => { if (value !== null) check(value); };
const bool = enumeration(true, false);
const ref = string(5, 180, /^syn:[A-Za-z0-9_./:-]+$/);
const id = string(1, 120, /^[A-Za-z0-9_./:-]+$/);
const sha = string(40, 40, /^[a-f0-9]{40}$/);
const digest = string(64, 64, /^[a-f0-9]{64}$/);
const positive = integer(1, 2_147_483_647);
const timestamp = integer(0, 4_102_444_800);
const repo = string(3, 180, /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);

// Inspect data descriptors before reading their values; getters are rejected.
function assertTree(value) {
  const seen = new Set();
  let nodes = 0;
  function walk(item, depth) {
    if (++nodes > 4_000 || depth > 12) fail();
    if (item === null || typeof item === 'boolean') return;
    if (typeof item === 'number') {
      if (!Number.isFinite(item)) fail();
      return;
    }
    if (typeof item === 'string') {
      if (item.length > 4_096) fail();
      return;
    }
    if (typeof item !== 'object' || seen.has(item)) fail();
    seen.add(item);
    const isArray = Array.isArray(item);
    if (Object.getPrototypeOf(item) !== (isArray ? Array.prototype : Object.prototype)) fail();
    const descriptors = Object.getOwnPropertyDescriptors(item);
    if (Reflect.ownKeys(descriptors).some((key) => typeof key !== 'string')) fail();
    const keys = Object.keys(descriptors);
    if (isArray) {
      const length = descriptors.length.value;
      if (length > 64 || keys.length !== length + 1) fail();
      for (let index = 0; index < length; index++) {
        const descriptor = descriptors[index];
        if (!descriptor || !Object.hasOwn(descriptor, 'value') || !descriptor.enumerable) fail();
        walk(descriptor.value, depth + 1);
      }
    } else {
      if (keys.length > 40) fail();
      for (const key of keys) {
        if (key.length > 80 || ['__proto__', 'constructor', 'prototype'].includes(key)) fail();
        const descriptor = descriptors[key];
        if (!Object.hasOwn(descriptor, 'value') || !descriptor.enumerable) fail();
        walk(descriptor.value, depth + 1);
      }
    }
  }
  walk(value, 0);
  if (encoder.encode(JSON.stringify(value)).length > MAX_BYTES) fail();
}

export function parseSimulationJSON(text) {
  if (typeof text !== 'string' || encoder.encode(text).length > MAX_BYTES) fail();
  let value;
  try { value = JSON.parse(text); } catch { fail(); }
  assertTree(value);
  return value;
}

const assignmentSchema = record({
  id, epoch: positive, kind: enumeration('workflow', 'application'),
});
const identityFields = { repo, pr: positive, head: sha, base: sha, merge: sha };
const identitySchema = record(identityFields);
const targetSchema = record({
  ...identityFields,
  scopeDigest: digest, policyDigest: digest, toolingDigest: digest,
  contractDigest: digest, diffDigest: digest,
});
const roleSchema = record({
  sessionId: ref, model: string(1, 64), reasoning: string(1, 16),
  metadataRef: ref, metadataKnown: bool,
});
const rolesSchema = record({
  planner: roleSchema, worker: roleSchema, reviewer: roleSchema,
});
const sourceFields = {
  appId: positive, workflowId: positive,
  path: string(8, 180, /^\.github\/workflows\/[A-Za-z0-9_.-]+\.ya?ml$/),
  digest, event: string(1, 40),
};
const ciSchema = record({
  ...sourceFields, runId: positive, attempt: positive, head: sha, testedMerge: sha,
  status: enumeration('queued', 'in_progress', 'completed'),
  conclusion: enumeration(
    null, 'success', 'failure', 'skipped', 'neutral', 'cancelled',
    'timed_out', 'action_required', 'stale', 'startup_failure',
  ),
});
const provenanceSchema = record({
  issuer: ref, keyId: ref, signatureReceipt: ref, reviewId: ref, nonce: ref,
});
const findingSchema = record({
  id, severity: enumeration('critical', 'high', 'medium', 'low'),
  location: string(1, 1_024), reason: string(1, 2_048),
  fix: string(1, 2_048), verify: string(1, 2_048),
});
const requestSchema = record({
  schemaVersion: enumeration(1), simulation: enumeration(true),
  assignment: assignmentSchema, sequence: positive,
  issuedAt: timestamp, expiresAt: timestamp,
  target: targetSchema, roles: rolesSchema, provenance: provenanceSchema,
  ci: nullable(ciSchema),
  verdict: enumeration('APPROVED', 'CHANGES_REQUESTED', 'BLOCKED'),
  allAcceptanceCriteria: bool, findings: array(findingSchema, 32),
  correctionPrompt: string(0, 4_096),
});
const contextSchema = record({
  schemaVersion: enumeration(1), simulation: enumeration(true),
  assignment: assignmentSchema, target: targetSchema, now: timestamp,
  sourceTrusted: bool, registry: rolesSchema, provenance: provenanceSchema,
  pullRequest: record({
    unique: bool, open: bool, draft: bool,
    mergeable: enumeration('clean', 'conflict', 'unknown'), pureDocs: bool,
  }),
  expectedCI: record({ ...sourceFields, event: enumeration('pull_request') }),
  currentCI: nullable(ciSchema),
  reviewPolicy: record({ maxAgeSeconds: positive }),
  replay: record({
    lastSequence: integer(0, 2_147_483_647),
    consumedReviewIds: array(ref), consumedNonces: array(ref),
    latestReview: nullable(requestSchema),
  }),
  lifecyclePolicy: record({ allowDocsOnlyDone: bool }),
});
function valid(value, schema) {
  try { assertTree(value); schema(value); return true; } catch { return false; }
}
function same(left, right) {
  if (left === right) return true;
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object') return false;
  const keys = Object.keys(left);
  return keys.length === Object.keys(right).length
    && keys.every((key) => Object.hasOwn(right, key) && same(left[key], right[key]));
}
const clone = (value) => JSON.parse(JSON.stringify(value));
const unique = (values) => new Set(values).size === values.length;
const result = (decision, reason, extra = {}) => ({
  simulationOnly: true, nativeGateVerified: false,
  decision, reasonCodes: [reason], ...extra,
});
const hold = (reason, replayUpdate) => result(
  'HOLD', reason, replayUpdate ? { replayUpdate } : {},
);
function registryProblem(context) {
  const entries = Object.entries(context.registry);
  const { planner, worker, reviewer } = context.registry;
  // PRD v1.6 permits sequential Planner/Worker stages in one chat, never self-review.
  if ([planner.sessionId, worker.sessionId].includes(reviewer.sessionId)) {
    return 'ROLE_SESSION_COLLISION';
  }
  // Each stage still needs its own metadata record; a shared chat is not a shared run.
  if (!unique(entries.map(([, role]) => role.metadataRef))) return 'ROLE_RUN_COLLISION';
  for (const [name, role] of entries) {
    if (!role.metadataKnown) return 'METADATA_UNKNOWN';
    const applicationWorker = context.assignment.kind === 'application' && name === 'worker';
    if (role.model !== (applicationWorker ? 'gpt-6.1-sol' : 'gpt-6-astra')
      || role.reasoning !== (applicationWorker ? 'medium' : 'high')) return 'ROLE_CONFIGURATION';
  }
  return null;
}
function prProblem(context) {
  const pr = context.pullRequest;
  if (!pr.unique) return 'PR_AMBIGUOUS';
  if (!pr.open) return 'PR_CLOSED';
  if (pr.draft) return 'PR_DRAFT';
  if (pr.mergeable !== 'clean') return 'PR_UNMERGEABLE';
  return null;
}
function ciProblem(context) {
  const ci = context.currentCI;
  if (!ci) return 'CI_MISSING';
  if (Object.keys(context.expectedCI).some((key) => ci[key] !== context.expectedCI[key])) {
    return 'CI_SOURCE_UNTRUSTED';
  }
  if (ci.head !== context.target.head || ci.testedMerge !== context.target.merge) return 'CI_TARGET_CHANGED';
  if (ci.status !== 'completed' || ci.conclusion !== 'success') return 'CI_NOT_SUCCESS';
  return null;
}

export function evaluateReview(request, context) {
  return evaluateReviewState(request, context);
}

// Private lifecycle-only reuse path. Public evaluation never bypasses replay.
function evaluateReviewState(request, context, allowConsumedLatest = false) {
  if (!valid(context, contextSchema)) return hold('INVALID_CONTEXT');
  if (!valid(request, requestSchema)) return hold('INVALID_REQUEST');
  if (!context.sourceTrusted) return hold('SOURCE_UNTRUSTED');
  if (!same(request.assignment, context.assignment)) return hold('ASSIGNMENT_CHANGED');
  if (!same(request.provenance, context.provenance)) return hold('PROVENANCE_MISMATCH');
  const roleIssue = registryProblem(context);
  if (roleIssue) return hold(roleIssue);
  if (!same(request.roles, context.registry)) return hold('ROLE_REGISTRY_MISMATCH');
  if (request.issuedAt > context.now || request.expiresAt <= context.now
    || request.expiresAt <= request.issuedAt
    || request.expiresAt - request.issuedAt > context.reviewPolicy.maxAgeSeconds) return hold('REVIEW_TIME_INVALID');
  const replay = context.replay;
  if (!unique(replay.consumedReviewIds) || !unique(replay.consumedNonces)) return hold('INVALID_CONTEXT');
  const latest = replay.latestReview;
  if (latest !== null && (latest.sequence !== replay.lastSequence
    || !replay.consumedReviewIds.includes(latest.provenance.reviewId)
    || !replay.consumedNonces.includes(latest.provenance.nonce))) return hold('INVALID_CONTEXT');
  const reuseLatest = allowConsumedLatest && latest !== null
    && same(request, latest) && request.sequence === replay.lastSequence
    && replay.consumedReviewIds.includes(request.provenance.reviewId)
    && replay.consumedNonces.includes(request.provenance.nonce);
  if (!reuseLatest && (replay.consumedReviewIds.includes(request.provenance.reviewId)
    || replay.consumedNonces.includes(request.provenance.nonce))) {
    return result('ALREADY_PROCESSED', 'REPLAY_NO_NEW_PLAN');
  }
  if (!reuseLatest && request.sequence <= replay.lastSequence) return hold('SEQUENCE_STALE');
  const replayUpdate = reuseLatest ? undefined : {
    lastSequence: request.sequence,
    consumedReviewIds: [...replay.consumedReviewIds.slice(-63), request.provenance.reviewId],
    consumedNonces: [...replay.consumedNonces.slice(-63), request.provenance.nonce],
    latestReview: clone(request),
  };
  const reject = (reason) => hold(reason, replayUpdate);
  if (!same(request.target, context.target)) return reject('TARGET_CHANGED');
  const prIssue = prProblem(context);
  if (prIssue) return reject(prIssue);
  if (!unique(request.findings.map((finding) => finding.id))) return reject('INCOMPLETE_REVIEW');
  if (request.verdict === 'BLOCKED') return reject('REVIEW_BLOCKED');
  if (request.verdict === 'CHANGES_REQUESTED') {
    if (request.allAcceptanceCriteria || !request.findings.length || !request.correctionPrompt.trim()) {
      return reject('INCOMPLETE_REVIEW');
    }
    return reject('REVIEW_CHANGES_REQUESTED');
  }
  if (!request.allAcceptanceCriteria || request.findings.length || request.correctionPrompt) {
    return reject('INCOMPLETE_REVIEW');
  }
  const ciIssue = ciProblem(context);
  if (ciIssue) return reject(ciIssue);
  if (!request.ci) return reject('CI_MISSING');
  if (!same(request.ci, context.currentCI)) return reject('CI_CHANGED');
  if (reuseLatest) return result('REUSABLE_APPROVAL', 'SYNTHETIC_APPROVAL_REUSED');
  return result('READY_TO_PUBLISH', 'SYNTHETIC_APPROVAL_ONLY', {
    replayUpdate,
    syntheticPublicationPlan: {
      kind: 'synthetic-success-plan', sequence: request.sequence,
      reviewId: request.provenance.reviewId, nonce: request.provenance.nonce,
      target: clone(context.target), ci: clone(context.currentCI),
    },
  });
}

export const STATES = Object.freeze([
  'BACKLOG', 'READY', 'IN_PROGRESS', 'IN_REVIEW', 'CHANGES_REQUESTED',
  'APPROVED', 'MERGED', 'STAGING', 'PRODUCTION_APPROVAL', 'DEPLOYED', 'DONE', 'BLOCKED',
]);
const stateSchema = record({
  schemaVersion: enumeration(1), simulation: enumeration(true),
  assignmentId: id, state: enumeration(...STATES),
  blockedFrom: enumeration(null, ...STATES), target: identitySchema,
});
const evidenceFields = Object.fromEntries([
  'planRef', 'readyRef', 'workRef', 'reviewRef', 'ciRef', 'gateRef', 'mergeRef',
  'stagingRef', 'approvalRef', 'deploymentRef', 'acceptanceRef',
  'backupRef', 'rollbackRef', 'blockerRef', 'recoveryRef',
].map((key) => [key, optional(ref)]));
const commandSchema = record({
  to: enumeration(...STATES),
  actor: enumeration('planner', 'worker', 'reviewer', 'owner', 'publisher'),
  evidence: record({
    ...evidenceFields,
    binding: optional(record({
      head: sha, base: sha, merge: sha, runId: positive, attempt: positive,
    })),
    reviewRequest: optional(requestSchema),
  }),
});
// Actors, required reference keys, fresh CI required, optional review verdict.
const RULES = {
  'BACKLOG>READY': [['owner'], ['planRef', 'readyRef'], false],
  'READY>IN_PROGRESS': [['worker'], ['workRef'], false],
  'IN_PROGRESS>IN_REVIEW': [['worker'], ['reviewRef'], true],
  'IN_REVIEW>CHANGES_REQUESTED': [['reviewer'], ['reviewRef'], false, 'CHANGES_REQUESTED'],
  'CHANGES_REQUESTED>IN_PROGRESS': [['worker'], ['workRef'], false],
  'IN_REVIEW>APPROVED': [['reviewer'], ['reviewRef'], true, 'APPROVED'],
  'APPROVED>IN_REVIEW': [['worker'], ['reviewRef'], true],
  'APPROVED>MERGED': [['owner'], ['mergeRef', 'gateRef'], true, 'APPROVED'],
  'MERGED>STAGING': [['owner'], ['stagingRef', 'backupRef', 'rollbackRef'], true],
  'STAGING>PRODUCTION_APPROVAL': [['owner'], ['stagingRef', 'approvalRef'], true],
  'PRODUCTION_APPROVAL>DEPLOYED': [['owner'], ['approvalRef', 'deploymentRef', 'backupRef', 'rollbackRef'], true],
  'DEPLOYED>DONE': [['owner'], ['acceptanceRef'], true],
};
const lockedStates = new Set([
  'IN_REVIEW', 'APPROVED', 'MERGED', 'STAGING', 'PRODUCTION_APPROVAL', 'DEPLOYED', 'DONE',
]);
function identity(target) {
  return Object.fromEntries(Object.keys(identityFields).map((key) => [key, target[key]]));
}
function freshEvidence(evidence, context) {
  if (!evidence.ciRef || !evidence.binding) return 'EVIDENCE_MISSING';
  const problem = ciProblem(context);
  if (problem) return problem;
  const expected = {
    head: context.target.head, base: context.target.base, merge: context.target.merge,
    runId: context.currentCI.runId, attempt: context.currentCI.attempt,
  };
  return same(evidence.binding, expected) ? null : 'EVIDENCE_STALE';
}
function reviewEvidence(evidence, context, verdict) {
  if (!evidence.reviewRequest) return 'EVIDENCE_MISSING';
  const evaluated = evaluateReviewState(evidence.reviewRequest, context, true);
  const accepted = verdict === 'APPROVED'
    ? ['READY_TO_PUBLISH', 'REUSABLE_APPROVAL'].includes(evaluated.decision)
    : evaluated.reasonCodes.includes('REVIEW_CHANGES_REQUESTED');
  return accepted ? null : 'REVIEW_EVIDENCE_REJECTED';
}

export function transitionLifecycle(state, command, context) {
  if (!valid(context, contextSchema)) return hold('INVALID_CONTEXT');
  if (!valid(state, stateSchema) || !valid(command, commandSchema)) return hold('INVALID_LIFECYCLE');
  if (!context.sourceTrusted) return hold('SOURCE_UNTRUSTED');
  const roleIssue = registryProblem(context);
  if (roleIssue) return hold(roleIssue);
  if (state.assignmentId !== context.assignment.id || state.target.repo !== context.target.repo
    || state.target.pr !== context.target.pr) return hold('IDENTITY_CHANGED');
  if ((state.state === 'BLOCKED') !== (state.blockedFrom !== null)
    || ['BLOCKED', 'DONE'].includes(state.blockedFrom)) return hold('INVALID_LIFECYCLE');
  const evidence = command.evidence;
  const next = (to, blockedFrom = null, target = identity(context.target)) => result(
    'TRANSITION_ALLOWED', 'SYNTHETIC_TRANSITION_ONLY',
    { nextState: { ...clone(state), state: to, blockedFrom, target: clone(target) } },
  );
  if (command.to === 'BLOCKED') {
    if (['BLOCKED', 'DONE'].includes(state.state)) return hold('TRANSITION_FORBIDDEN');
    if (!evidence.blockerRef) return hold('EVIDENCE_MISSING');
    return next('BLOCKED', state.state, state.target);
  }
  if (state.state === 'BLOCKED') {
    if (command.to !== state.blockedFrom || command.actor !== 'owner') return hold('RECOVERY_FORBIDDEN');
    if (!evidence.recoveryRef) return hold('EVIDENCE_MISSING');
    if (['IN_REVIEW', 'APPROVED', 'CHANGES_REQUESTED'].includes(state.blockedFrom)) {
      const issue = prProblem(context);
      if (issue) return hold(issue);
    }
    if (lockedStates.has(state.blockedFrom)) {
      if (!same(state.target, identity(context.target))) return hold('SNAPSHOT_STALE');
      const issue = freshEvidence(evidence, context);
      if (issue) return hold(issue);
      if (state.blockedFrom === 'APPROVED') {
        const reviewIssue = reviewEvidence(evidence, context, 'APPROVED');
        if (reviewIssue) return hold(reviewIssue);
      }
      if (['MERGED', 'STAGING', 'PRODUCTION_APPROVAL', 'DEPLOYED'].includes(state.blockedFrom)
        && !evidence.gateRef) return hold('EVIDENCE_MISSING');
    }
    return next(state.blockedFrom);
  }
  let rule = RULES[`${state.state}>${command.to}`];
  if (state.state === 'MERGED' && command.to === 'DONE') {
    if (!context.lifecyclePolicy.allowDocsOnlyDone || !context.pullRequest.pureDocs) {
      return hold('DOCS_SHORTCUT_DISABLED');
    }
    rule = [['owner'], ['acceptanceRef'], true];
  }
  if (!rule) return hold('TRANSITION_FORBIDDEN');
  const [actors, required, fresh, verdict] = rule;
  if (!actors.includes(command.actor)) return hold('ACTOR_FORBIDDEN');
  if (required.some((key) => !evidence[key])) return hold('EVIDENCE_MISSING');
  const reReview = state.state === 'APPROVED' && command.to === 'IN_REVIEW';
  if (lockedStates.has(state.state) && !reReview
    && !same(state.target, identity(context.target))) return hold('SNAPSHOT_STALE');
  if (['IN_REVIEW', 'APPROVED', 'MERGED', 'CHANGES_REQUESTED'].includes(command.to)) {
    const issue = prProblem(context);
    if (issue) return hold(issue);
  }
  if (fresh) {
    const issue = freshEvidence(evidence, context);
    if (issue) return hold(issue);
  }
  if (verdict) {
    const issue = reviewEvidence(evidence, context, verdict);
    if (issue) return hold(issue);
  }
  return next(command.to);
}
