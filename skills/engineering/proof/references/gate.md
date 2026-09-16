---
type: Protocol
title: Deterministic proof gate
description: Define the local contract, frozen baseline, check receipts, verdicts, and completion decision.
tags: [gate, schema, cli, integrity]
timestamp: 2026-09-16T00:57:57Z
---

# Run the shipped tool

Use `scripts/proof_gate.py` from the installed skill, with Python 3.10+ and Git available. It maintains a local acceptance record; it is not an authenticated execution service. Read [verification](./verification.md) before interpreting a PASS.

The CLI has `validate`, `freeze`, `run`, `verdict`, and `gate` subcommands. The skill's `build` and full `run` operations include agent work; they are not the CLI's `run` subcommand, which executes one explicit command.

Replace `CONTRACT_PATH` with the path resolved from the project's [requirements structure](./okf-profile.md). It is a placeholder, not a fixed destination. The `.proof/STORY-421-r1` paths illustrate the selected evidence directory; substitute the project's dedicated generated-output location consistently when it already has one.

```text
python /path/to/proof/scripts/proof_gate.py validate CONTRACT_PATH
python /path/to/proof/scripts/proof_gate.py freeze CONTRACT_PATH --evidence .proof/STORY-421-r1 --builder agent:builder-session-1 --verifier agent:verifier-session-2
python /path/to/proof/scripts/proof_gate.py run --evidence .proof/STORY-421-r1 --check A421-1.persist -- node node_modules/@playwright/test/cli.js test tests/projects/title.spec.ts --grep '@A421-1(\s|$)' --reporter=json --output .proof/STORY-421-r1/artifacts/test-results
python /path/to/proof/scripts/proof_gate.py verdict --evidence .proof/STORY-421-r1 --check A421-1.persist --result PASS --by agent:verifier-session-2 --observed "The saved title was returned after reopening; the matching persistence assertion passed."
python /path/to/proof/scripts/proof_gate.py run --evidence .proof/STORY-421-r1 --check A421-2.failure -- node node_modules/@playwright/test/cli.js test tests/projects/title.spec.ts --grep '@A421-2(\s|$)' --reporter=json --output .proof/STORY-421-r1/artifacts/failure-results
python /path/to/proof/scripts/proof_gate.py verdict --evidence .proof/STORY-421-r1 --check A421-2.failure --result PASS --by agent:verifier-session-2 --observed "The failed-save scenario retained the entered title and displayed the failure alert."
```

This sequence matches the [worked example](./worked-example.md), assuming its tests have been implemented and `@playwright/test` is installed locally. Record PASS only after inspecting actual output. Record the scope-inspection check below, then run the gate. Replace test locations and executables when adapting the contract to another project.

Commands after `--` are explicit argv supplied by the caller, run from the Git root. Contract text never becomes a command automatically. Child processes have the caller's access; inspect commands and use the project's existing execution permissions. The examples invoke the installed Playwright JavaScript entrypoint with Node so they also work in PowerShell without resolving `npx` batch shims. If choosing a Windows package-manager shim instead, invoke it explicitly, for example `-- cmd.exe /d /c npx playwright test`; the CLI does not insert a shell for a bare `npx`, `npm`, or `pnpm` name. Use the project's actual executable and argument quoting.

# Machine contract

An Acceptance concept has frontmatter containing the unquoted line `type: Acceptance` and exactly one fence whose opening line is ` ```json proof-contract `, without the surrounding spaces. Its payload is the only machine source of truth:

| Field | Shape and meaning |
| --- | --- |
| `proof` | Integer `1`, the local protocol version |
| `story` | Object with nonempty `id` and `title`; optional `as_a`, `i_want`, and `so_that` strings |
| `scope` | Object with nonempty string array `in` and string array `out` |
| `policy` | Optional array of repository-relative files to pin |
| `criteria` | Nonempty array of objects with `id`, `behavior`, and nonempty `checks` |
| Check | Object with globally unique `id`, `kind`, and nonempty `expect` naming the test/tag/inspection target and observable expectation |
| `kind` | `command`, `inspection`, or `human` |
| `expect_exit` | Optional command-check exit code, default `0` |

IDs use letters, digits, dots, underscores, and hyphens, start with a letter or digit, and are at most 64 characters. Criterion and check IDs must not collide, including case-only differences. Unknown keys, duplicate JSON keys, nonfinite values, empty criteria, and invalid paths are rejected. Assumptions and unresolved decisions belong in the concept's prose; resolve the latter before freezing.

The parser checks the controlled markers and JSON, not full YAML or OKF conformance. Validate the containing bundle separately. See [OKF placement](./okf-profile.md) and the complete [example](./worked-example.md).

The check ID is a stable evidence key. Put the concrete test selector, file, command, or inspection target in `expect` as well as the expected observation. The verifier must confirm its supplied argv actually selects that check; this version does not mechanically compare argv to prose.

# Baseline and evidence

`freeze` records the contract and policy SHA-256 values, complete criterion/check inventory, evidence directory, declared builder/verifier identities, and a unique `freeze_id`. Every run and verdict binds that freeze identity. Re-freezing invalidates previous evidence even if the contract bytes are identical. Use identities that represent actual distinct sessions. To revise a contract, use a new revision directory and retain the old baseline. Do not use overwrite options to conceal a changed requirement.

The evidence directory must be a narrow dedicated location inside the worktree, separate from source, tests, contract, and policies. Prefer `.proof/<story-revision>` and never place implementation files there. It is the sole explicit exclusion from the candidate digest.

Before freezing or running checks, put generated `.proof/` output in the repository's `.gitignore`, unless the project already has an equivalent ignored output root. Also ignore genuinely generated runner directories such as `test-results/` and `playwright-report/`, or configure their output beneath the active evidence directory as above. Never ignore source, tests, or required configuration to make a digest pass. Otherwise recurring report writes change the candidate during every run; other revision directories can also invalidate one another. Git ignores do not hide files already tracked: keep durable evidence in a CI artifact store or external archive, and keep only stable knowledge records in the tracked bundle.

| Artifact | Role |
| --- | --- |
| `freeze.json` | Baseline contract, policy, identities, and inventory |
| `runs/<check>.json` | Explicit argv, execution outcome, candidate before/after, output hashes |
| `runs/<check>.stdout` and `.stderr` | Captured process output |
| `verdicts.json` | Per-check judgment, observation, actor, candidate, bound run, and artifacts |
| `report.json` | Current deterministic gate decision and reasons |
| `artifacts/` | Inspected screenshots, reports, or findings referenced by verdicts |

`run` alone does not award PASS. The verifier inspects its output and records a verdict. A command needs nonempty captured output or an attached artifact; a silent successful process alone is insufficient. Inspection and human checks require an attached nonempty finding artifact. For a human check, attach the actual human's finding and use their identity only when the finding exists:

```text
python /path/to/proof/scripts/proof_gate.py verdict --evidence .proof/STORY-421-r1 --check A421-3.scope --result PASS --by agent:verifier-session-2 --observed "The patch changes only the title flow and does not modify dependency manifests." --artifact artifacts/scope.txt
python /path/to/proof/scripts/proof_gate.py gate --evidence .proof/STORY-421-r1
```

Paths passed to `--artifact` are relative to the evidence directory and must stay under its `artifacts/` subdirectory. Create `artifacts/scope.txt` from the actual inspection before running its verdict command. Do not capture credentials or unrelated private data in logs or screenshots. Preserve earlier attempts beneath `<evidence>/artifacts/attempts/<attempt-id>/` or in an external archive before replacing a check's latest run or verdict; an arbitrary `<evidence>/attempts/` directory is not allowed. The mutable working records are not an append-only history.

# Decision and freshness

The gate accepts only a complete PASS over every frozen check. It recomputes the contract, policy, artifacts, and current candidate; it checks coverage and rejects malformed or contradictory records. Missing results remain UNVERIFIED. FAIL and UNVERIFIED both prevent completion. An exit contradicting the frozen expected exit cannot support PASS; unavailable execution remains UNVERIFIED.

Candidate identity covers tracked and nonignored untracked files, including code, tests, and configuration, plus missing tracked-file state. Evidence is bound to that candidate, not merely to a branch name or HEAD. A check that changes the candidate needs a new run on the settled candidate. A stale run cannot be refreshed by rewriting only its verdict.

Exit `0` means all checks passed; exit `1` means acceptance has FAIL or UNVERIFIED checks; exit `2` means malformed input or an integrity problem. Inspect the command's current output, not an old `report.json`, when evaluation cannot complete.

# Practical limits

Actor names and observations are declarations. Hashes detect drift against the stored baseline; they do not protect that baseline from replacement. A command that prints a success message is not behavior verification. The independent verifier must assess assertions, discovery counts, skips, retries, and environment identity.

Ignored files, external services, remote deployments, and runtime configuration outside the worktree are not established by the candidate hash. Pin relevant inputs as policies where supported and retain environment evidence. A tracked symlink contributes its link target text, not the external target's contents. Tracked directories and submodules are rejected because this version cannot establish their candidate contents. This version targets ordinary local Git worktrees; line-ending differences across checkouts can change digests. Re-run locally instead of claiming portability of a raw-byte receipt.

The gate is derived from the [acceptance lifecycle](./lifecycle.md). Its schema and decision rules are this skill's implementation, not normative OKF fields; see [sources](./sources.md).

The direct Playwright invocation uses the package's published `cli.js` entrypoint, confirmed in the [official package manifest](https://github.com/microsoft/playwright/blob/main/packages/playwright-test/package.json) on 2026-09-16.
