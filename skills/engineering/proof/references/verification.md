---
type: Runbook
title: Independent verification
description: Evaluate every acceptance criterion against current candidate evidence without inheriting the builder's verdict.
tags: [verification, evidence, testing]
timestamp: 2026-09-16T00:42:23Z
---

# Handoff

The verifier receives the frozen [contract](./acceptance-contract.md), pinned policies, candidate checkout, diff or baseline, check locations, and required environment setup. Give it the original requirements and access to the implementation. Withhold the builder's proposed verdict and persuasive summary. Independence means a separate evaluation context and responsibility; using the same model family is not inherently disqualifying.

Use a new subagent or fresh CLI session when the harness permits it. Keep normal tool permissions and expose only resources needed for verification. A label such as `verifier-2` does not establish isolation. If no independent context is available, collect provisional evidence and report that independent verification remains unavailable. Do not impersonate another actor to satisfy the gate.

# Evaluate coverage first

Build the requirement-to-check mapping from the frozen contract. Inspect the selected test bodies and actual test discovery. Confirm that each expected behavior has a meaningful assertion, each relevant actor/configuration is covered, and applicable [policy](./project-policy.md) checks are included. Read the diff for scope drift and weakened assertions.

Playwright supports tags and filtering with `--grep`; tags can be in a title or test details. Its JSON reporter can supply structured execution evidence. [1][2] Use precise selectors: `@A421-1` must not accidentally select only `@A421-10`. Inspect the discovered cases rather than trusting a substring match.

The following are not sufficient for a criterion to pass: a matching filename, a discovered tag, an exit code without a meaningful assertion, a compile-only command, an empty screenshot, or a report from a previous candidate. Treat skipped, disabled, expected-failure, or zero-execution cases as missing acceptance evidence unless another valid check actually proves the criterion. Do not use a no-tests-success flag.

# Run and interpret

| Result | Meaning | Required record |
| --- | --- | --- |
| `PASS` | The required behavior was observed on this candidate | What ran, actual observation, and inspectable evidence |
| `FAIL` | Observed behavior contradicted the criterion | Failure output and a reproducible condition |
| `UNVERIFIED` | Evidence was unavailable or insufficient | Missing tool, blocked environment, skipped case, or other concrete gap |

Use unit or integration tests for logic and persistence, browser checks for complete user flows, and component interaction checks for isolated component behavior. A Storybook rendering does not by itself prove keyboard interaction or a server round trip. Keep test tooling native to the project.

For manual inspection, record the criterion, candidate, exact inspected surface, observation, reviewer, and an artifact containing the finding. A human-designated criterion requires a real human finding; a model cannot supply it under a human name. Machine inspection can be sufficient where the frozen contract asks for machine inspection. Screenshots support visible state; they rarely prove persistence or absence of a backend side effect.

# Freshness and retries

Run against one identifiable candidate and environment. The [gate](./gate.md) checks local candidate and evidence fingerprints. Browser base URL, deployed build identity, database fixture, feature flags, and external services also affect results; include them in observations or an environment artifact. A local hash cannot establish which build a remote URL served.

Record failed attempts and retries. Do not hide a flaky first attempt behind a final green report. Resolve unexplained flakes before awarding PASS; if the team has an explicit retry policy, apply it and state the first-attempt and retry outcomes. Any code, test, configuration, or frozen-policy change requires verification of the resulting candidate. Follow the [lifecycle](./lifecycle.md) when work returns to the builder.

# Citations

[1] [Playwright annotations](https://playwright.dev/docs/test-annotations), consulted 2026-09-16, supplies tag and filtering support.
[2] [Playwright reporters](https://playwright.dev/docs/test-reporters), consulted 2026-09-16, supplies structured reporter support. The coverage, independence, and result policies are this skill's design, traced in [sources](./sources.md).
