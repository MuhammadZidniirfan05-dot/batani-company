// Every identity, receipt, CI run, and evidence reference below is synthetic.
const copy = (value) => JSON.parse(JSON.stringify(value));
const assignment = { id: 'F1-synthetic', epoch: 1, kind: 'workflow' };
const target = {
  repo: 'MuhammadZidniirfan05-dot/batani-company', pr: 123,
  head: 'a'.repeat(40), base: 'b'.repeat(40), merge: 'c'.repeat(40),
  scopeDigest: '1'.repeat(64), policyDigest: '2'.repeat(64),
  toolingDigest: '3'.repeat(64), contractDigest: '4'.repeat(64), diffDigest: '5'.repeat(64),
};
const roles = Object.fromEntries(['planner', 'worker', 'reviewer'].map((role) => [
  role, {
    sessionId: `syn:session/${role}`, model: 'gpt-6-astra', reasoning: 'high',
    metadataRef: `syn:metadata/${role}`, metadataKnown: true,
  },
]));
const provenance = {
  issuer: 'syn:issuer/reviewer', keyId: 'syn:key/1', signatureReceipt: 'syn:receipt/1',
  reviewId: 'syn:review/1', nonce: 'syn:nonce/1',
};
const ci = {
  appId: 101, workflowId: 202, path: '.github/workflows/synthetic-m0.yml',
  digest: '9'.repeat(64), event: 'pull_request', runId: 303, attempt: 1,
  head: 'a'.repeat(40), testedMerge: 'c'.repeat(40),
  status: 'completed', conclusion: 'success',
};
export function fixture() {
  // Separate objects supplied through independent arguments; not external attestation.
  const context = {
    schemaVersion: 1, simulation: true,
    assignment: copy(assignment), target: copy(target), now: 1_800_000_000,
    sourceTrusted: true, registry: copy(roles), provenance: copy(provenance),
    pullRequest: { unique: true, open: true, draft: false, mergeable: 'clean', pureDocs: true },
    expectedCI: {
      appId: 101, workflowId: 202, path: '.github/workflows/synthetic-m0.yml',
      digest: '9'.repeat(64), event: 'pull_request',
    },
    currentCI: copy(ci),
    // Synthetic fixture parameter, not an owner-approved production SLA.
    reviewPolicy: { maxAgeSeconds: 3_600 },
    replay: {
      lastSequence: 0, consumedReviewIds: [], consumedNonces: [], latestReview: null,
    },
    lifecyclePolicy: { allowDocsOnlyDone: false },
  };
  const request = {
    schemaVersion: 1, simulation: true, assignment: copy(assignment), sequence: 1,
    issuedAt: 1_799_999_940, expiresAt: 1_800_000_600,
    target: copy(target), roles: copy(roles), provenance: copy(provenance), ci: copy(ci),
    verdict: 'APPROVED', allAcceptanceCriteria: true, findings: [], correctionPrompt: '',
  };
  return { request, context };
}
export function changes(request) {
  return {
    ...copy(request), verdict: 'CHANGES_REQUESTED', allAcceptanceCriteria: false,
    findings: [{
      id: 'F1', severity: 'high', location: 'synthetic-file:10',
      reason: 'Synthetic missing freshness check.',
      fix: 'Bind the decision to the current synthetic CI attempt.',
      verify: 'Reject the earlier synthetic attempt.',
    }],
    correctionPrompt: 'Fix F1 on the same synthetic PR and rerun its synthetic checks.',
  };
}
export function lifecycleState(context, state = 'BACKLOG') {
  return {
    schemaVersion: 1, simulation: true, assignmentId: context.assignment.id,
    state, blockedFrom: null,
    target: Object.fromEntries(['repo', 'pr', 'head', 'base', 'merge'].map(
      (key) => [key, context.target[key]],
    )),
  };
}
export function command(context, to, actor, evidence = {}) {
  return {
    to, actor,
    evidence: {
      binding: {
        head: context.target.head, base: context.target.base, merge: context.target.merge,
        runId: context.currentCI?.runId ?? 1, attempt: context.currentCI?.attempt ?? 1,
      },
      ...copy(evidence),
    },
  };
}
