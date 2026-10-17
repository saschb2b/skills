---
type: Template
title: Progress dashboard
description: Give humans one offline HTML file that shows the goal, scope, unit progress, stop rule, ledger health, masks, open questions, and decisions, rewritten from the ledger and the last oracle run at the end of every iteration.
tags: [reverse-engineering, reporting, dashboard]
generated: { by: claude-code/unversioned, at: 2026-10-17T18:00:00Z }
sources:
  - id: skill-asset
    resource: "scope:this skill's assets/dashboard.html and its re-state/1 state block, authored with the dashboard"
---

# Set it up in phase 0

Copy `assets/dashboard.html` from this skill into the project, next to the [ledger](./ledger.md) (for example `docs/re/dashboard.html`). It is one file with no network access and no dependencies: open it in any browser, attach it, or publish it as it is. Replace the example in `<script type="application/json" id="re-state">` with the project's own state and drop `"example": true`. The page never needs editing beyond that block; a viewer can also load another state file with its picker or by dropping it on the page.

# Rewrite the state every iteration

At the end of phase 6 and before every report, rewrite the whole block:

- Take every figure from a tool read: the last oracle run's verdicts and mutation results from the [differential](./differential.md), the claim counts from the ledger. Never estimate, round, or carry a number over from memory. Leave out what you do not know; the page shows a dash.
- Set `generated_at` and `target.hash` on every write, and append one `history` entry per iteration.
- Write `<` inside strings as `<`, so the block cannot close early.
- Put only your own names and numbers in it. No text, code, or assets from the target, by the same legal line as the repository.

The page is a view, never a second source of truth. When it disagrees with the ledger or the oracle, they win and you rewrite the state.

# Schema `re-state/1`

| Field | Holds |
| --- | --- |
| `schema` | `"re-state/1"` |
| `generated_at`, `generated_by` | ISO 8601 time of the write, and the agent or person who wrote it |
| `project` | The project's name |
| `target` | `name`, `class` (a row of the [target profiles](./targets.md)), `build`, `hash`, `oracle` |
| `goal` | `acceptance` (the phase 0 sentence), `non_goals` (list), `legal` |
| `phase` | `current` (0 to 6) and `unit` (the unit in work) |
| `stop_rule` | `{id, met, evidence}` for the ids `specs`, `mutations`, `ledger`, `masks`, `ci`; `evidence` names the run or file |
| `units` | `{id, name, phase, status, specs: {pass, fail, inconclusive}, mutations: {caught, total}, attempts: {used, budget}, note}`; `status` is `planned`, `active`, `passed`, `failed`, `stalled`, or `blocked` |
| `ledger` | `source` (the ledger's path) and the counts `verified`, `derived`, `assumed`, `open`, `refuted` |
| `masks` | `{name, reason}` for every allowed difference |
| `open_questions` | `{question, settles_with}` |
| `decisions` | `{question, options, needed_by}`: what waits on a person |
| `not_reached` | States, inputs, and code paths no spec exercised |
| `history` | `{at, specs_pass, specs_total, mutations_caught, mutations_total, note}`, one per iteration |

# What the page checks

The page lints the state it shows and lists what it finds: no `generated_at` or a stale one, a target not pinned by hash, a unit marked passed with failing or inconclusive specs or surviving breaks or no mutation record, a mask without a reason, a stop-rule item marked met without evidence or against the units' own figures, and every stop-rule item met while some unit has not passed. A finding means fix the state or the work. Never change the page's checks or labels to make one go away: the page is part of the oracle's reporting, and the builder does not edit the oracle.
