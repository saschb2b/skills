---
type: Example
title: Saved title acceptance
description: Trace a small story through contract, check selection, independent observations, and gate outcomes.
tags: [example, contract, tests]
timestamp: 2026-09-16T00:57:57Z
---

# Story and decisions

Illustrative story: as a project member, I want to rename a project so I can recognize it later. The team agrees that a successful save persists on reopening and that a failed save preserves the entered title and shows a failure alert. This example invents no latency budget or exact error wording.

The team already requires scoped changes without unexplained dependency additions. A real task would point at the existing policy file. This self-contained example leaves `policy` empty and makes its scope inspection explicit.

# Acceptance concept

Resolve the destination using [knowledge placement](./okf-profile.md), then create and index `STORY-421.md` in that acceptance area. The example does not prescribe the parent directory; use its resolved path as `CONTRACT_PATH` in the [CLI walkthrough](./gate.md). The following is the entire starting concept; the four-backtick outer fence only displays the embedded contract fence.

````markdown
---
type: Acceptance
title: Rename a project
description: Persist a saved project title and preserve input when saving fails.
tags: [acceptance, projects]
timestamp: 2026-09-16T00:57:57Z
---

Members need to recognize renamed projects after returning to the project list.
The existing permission rules and title-validation rules remain the basis for
valid input. No new title-length rule is introduced by this story.

```json proof-contract
{
  "proof": 1,
  "story": {"id": "STORY-421", "title": "Rename a project"},
  "scope": {
    "in": ["Existing project-title editing and persistence"],
    "out": ["Permission redesign", "Project deletion", "Unrelated dependency changes"]
  },
  "policy": [],
  "criteria": [
    {
      "id": "A421-1",
      "behavior": "When a member saves a valid project title, the application shall show that title after the project is reopened.",
      "checks": [
        {"id": "A421-1.persist", "kind": "command", "expect": "Playwright case tagged @A421-1 in tests/projects/title.spec.ts saves a title, reopens the project, and asserts the saved title."}
      ]
    },
    {
      "id": "A421-2",
      "behavior": "If saving the title fails, then the application shall preserve the entered title and show a failure alert.",
      "checks": [
        {"id": "A421-2.failure", "kind": "command", "expect": "Playwright case tagged @A421-2 in tests/projects/title.spec.ts forces a save failure and asserts retained input and a failure alert."}
      ]
    },
    {
      "id": "A421-3",
      "behavior": "The change shall stay within the title-editing scope without unrelated dependency changes.",
      "checks": [
        {"id": "A421-3.scope", "kind": "inspection", "expect": "Diff inspection identifies changed surfaces and checks manifests and lockfiles for unrelated changes."}
      ]
    }
  ]
}
```
````

When adapting this example, link the concept to the actual project policy or an outcome concept so it participates in the knowledge graph. Do not copy invented policy into a real repository as if it were already agreed.

# Choose the checks

Use existing project tests where they already prove the behavior. A browser flow can prove save-and-reopen through the application. A service integration test can prove persistence if UI behavior is independently covered. The failure criterion can use a component test if the component owns both preserved input and alert rendering. Select based on the actual system boundary, not on the EARS keyword.

A Playwright test may carry `@A421-1`; inspect its body and the discovered cases before accepting it as the persistence check. Reloading an in-memory component is not reopening persisted state if the contract requires server persistence. A happy-path screenshot does not prove the failure criterion.

# Execute and interpret

Freeze the concept, build the flow, and hand the candidate to a new verifier. Use the [gate CLI](./gate.md) to run each explicitly chosen command and bind its observed result. Record the scope inspection in an artifact and attach it to its verdict.

| Observation | Correct result |
| --- | --- |
| Persistence assertion runs and observes the saved title after reopening | PASS for `A421-1.persist` |
| Failure check observes input clearing after the failed request | FAIL for `A421-2.failure`; repair the implementation |
| Browser binaries cannot start | UNVERIFIED for that command check; no inferred pass |
| Failure check is skipped while the suite exits successfully | UNVERIFIED; an exit code is insufficient |
| Scope finding is recorded but no supporting artifact exists | Incomplete evidence; attach the actual finding |
| Builder repairs input retention after a previous PASS | Old results are stale for the new candidate; verify again |

Only complete, fresh PASS results permit the gate to pass. The final acceptance report states the candidate digest and evidence location. It does not claim that this small example proved a business metric or authorized release. Use [verification](./verification.md) for evidence interpretation and [lifecycle](./lifecycle.md) for later regression handling.

# Citations

This is an authored example of the [contract method](./acceptance-contract.md), not a claim about an existing product or a captured real test run.
