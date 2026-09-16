---
name: proof
description: Carry a given story to evidence-backed completion through a frozen acceptance contract, independent verification, and a deterministic completion gate. Use when turning a story into checkable acceptance criteria, proving delivered behavior, or running a contract-build-verify loop. Story drafting alone belongs to to-story; choosing work belongs to autopilot; artifact signatures belong to trust-card.
tags: [engineering, acceptance, verification, agents]
date: 2026-09-16
---

# Proof

Own the acceptance loop for a given task. Preserve the team's stories, sprints, and existing test tools. Make the intended outcome explicit, collect evidence for it, and report completion only when the gate passes for the current candidate.

## Choose the operation

| Request | Operation | Read |
| --- | --- | --- |
| Define what successful delivery means | `contract` | [Acceptance contract](./references/acceptance-contract.md), [EARS](./references/ears.md), [OKF placement](./references/okf-profile.md) |
| Implement the agreed contract | `build` | [Lifecycle](./references/lifecycle.md), then the target contract and its pinned policies |
| Independently assess delivered behavior | `verify` | [Verification](./references/verification.md), [gate protocol](./references/gate.md) |
| Evaluate recorded results | `gate` | [Gate protocol](./references/gate.md) and [scripts/proof_gate.py](./scripts/proof_gate.py) |
| Carry the story through delivery | `run` | Follow the loop below; load each reference when its phase begins |

These are skill operations, not installed shell commands. `/proof run` or `$proof` plus a story starts the full loop; a request only for `contract` stops after preparing that contract.

## Run the loop

1. Locate the given story, repository, current Definition of Done, and available checks. Resolve contract and policy locations from the project's documentation structure and bundle metadata using [knowledge placement](./references/okf-profile.md). Do not infer a directory name from the OKF format or pick unrelated work.
2. Write the smallest complete contract. Give each criterion a stable ID, an observable outcome, and a named check. Capture scope, non-goals, assumptions, and relevant policy obligations. Resolve material ambiguities before freezing; do not invent thresholds, text, or human approval.
3. Freeze the exact contract and policy inputs with the bundled CLI. Existing authorization can cover implementation; freezing does not create a universal approval ceremony. A change in required behavior needs an explicit contract revision, not a weakened test.
4. Implement within the contract. Reuse useful tests at the cheapest layer that observes the outcome. A regression test should fail for the intended defect when practical; a setup failure is not evidence of a useful red test.
5. Hand the contract, policy, candidate, and check locations to an independent verifier in fresh context. This skill explicitly calls for a separate agent/session for that bounded role when available. The builder's conclusions are not evidence. If independent execution is unavailable, preserve that limit and leave independent verification incomplete.
6. The verifier checks coverage, runs the checks, inspects assertions and artifacts, and records `PASS`, `FAIL`, or `UNVERIFIED` per criterion. Test tags establish traceability; they do not establish correctness. Use [verification](./references/verification.md) for retries, manual criteria, and missing tools.
7. Run the deterministic gate. Repair failed implementation or checks and repeat verification for the new candidate. Stop for an unresolved product decision, missing required access, or a repeated failure with no new diagnostic path. Never turn a blocked check into `PASS` to end the loop.
8. Report the gate result, candidate identity, criterion results, and evidence location. A passing gate establishes the contracted acceptance checks; it does not authorize merge, deployment, ticket updates, or human sign-off.

## Keep the boundary honest

- The frozen contract defines the claim; test execution supplies observations; the verifier interprets them; the gate enforces completeness, consistency, and freshness.
- The local gate cannot authenticate an actor or guarantee that a test proves the intended behavior. Use protected CI and review controls when that assurance is needed.
- Preserve `FAIL` versus `UNVERIFIED`. Both block acceptance, for different reasons.
- Do not edit the gate, contract, or expected result merely to make a failing story pass. A legitimate change is a separately reviewed revision that invalidates previous evidence.
- Scale the contract to the task. Do not install another specification framework or convert every tiny edit into a large test suite.

## Reference bundle

[Index](./references/index.md) routes the vendored OKF knowledge. Read only the relevant concepts:

- [Acceptance contract](./references/acceptance-contract.md): reader job, scope, IDs, and freezing.
- [EARS](./references/ears.md): sentence patterns and test design.
- [Verification](./references/verification.md): independent execution and evidence grading.
- [Lifecycle](./references/lifecycle.md): ownership, repair, revision, and archival.
- [Project policy](./references/project-policy.md): shared DoD and stable obligations.
- [OKF placement](./references/okf-profile.md): concepts, provenance, and version boundaries.
- [Gate protocol](./references/gate.md): exact CLI and machine schema.
- [Worked example](./references/worked-example.md): a story through acceptance.
- [Sources and decisions](./references/sources.md): conversation coverage and corrected claims.
