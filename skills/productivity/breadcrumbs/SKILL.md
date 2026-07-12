---
name: breadcrumbs
description: Heal codebase understanding gaps exposed during implementation, debugging, or investigation. Use when tracing reveals misleading names, repeated backtracking, disconnected navigation paths, hidden contracts, surprising dependencies, stale documentation, unclear errors, undocumented constraints, false leads, or avoidable complexity. Make the smallest durable improvement at the source through clearer code, types, validation, tests, errors, comments, or existing documentation. Also use when a task was harder to grasp than it should have been or you think "that should have been documented." Do not create a breadcrumb trail, investigation log, freshness system, or separate knowledge store.
tags: [workflow, documentation, maintainability]
date: 2026-07-12
---

# Breadcrumbs

## Leave the path clearer

Treat avoidable confusion encountered during real work as evidence of a codebase smell. Before leaving the area, remove a small part of the friction that made it difficult to understand.

The healed codebase is the breadcrumb. Do not create a trail, registry, entry format, freshness stamp, or read-before-investigating ritual. Improve the place where understanding failed so the next developer benefits without knowing this skill exists.

Close every non-trivial trace with one question: what specific feature of the codebase made this harder to grasp than the behavior warranted? If the answer identifies a repeatable expectation failure, run the loop. If it identifies only unfamiliarity or genuine domain complexity, make no incidental change.

## Run the healing loop

1. **Notice the expectation failure.** Catch moments such as "that name sent me the wrong way," "I had to inspect every caller," or "that should have been documented."
2. **Finish the trace.** Distinguish a repeatable codebase problem from temporary unfamiliarity or inherently difficult domain knowledge.
3. **Name the smell.** Identify what caused the friction: misleading information scent, hostile navigation topology, an implicit contract, hidden rationale, fragmented ownership, diagnostic opacity, stale guidance, or accidental complexity. Use the [smell catalog](references/smells.md) when the cause is ambiguous.
4. **Choose one coherent repair.** Prefer removing confusion, then clearer code, executable constraints, better diagnostics, a local why, and finally an existing documentation surface. One repair may touch code, tests, and existing docs when they close the same expectation gap. Use the [repair patterns](references/repairs.md) for concrete transformations and placement guidance.
5. **Check scope.** Keep the repair close to the traced area, useful beyond this session, and small enough to verify. Use the [scope rails](references/scope-rails.md) when the repair changes behavior, public contracts, architecture, or files outside the task.
6. **Heal and verify.** Apply the repair while the evidence is fresh. Run the narrowest relevant test, type check, documentation check, or reference search.
7. **Continue the task.** Mention the incidental repair in the normal handoff. Do not maintain a ledger.

## Prefer the strongest durable form

Choose the highest useful rung that fits safely:

1. Delete obsolete or misleading material.
2. Rename, relocate, simplify, or expose the right entry point.
3. Encode the contract in types, schemas, validation, assertions, or tests.
4. Improve errors and diagnostic context.
5. Explain a reason that code cannot express in a short adjacent comment.
6. Update the existing documentation surface readers already use.

Prefer executable clarity over prose. A comment is for a reason or constraint, not a narration of visible code. Documentation is for setup, navigation, cross-cutting concepts, and operational knowledge that does not belong in one symbol.

## Apply the two tests

Before editing, ask:

- **Repeatability:** could another competent developer reasonably hit the same confusion?
- **Payoff:** would this repair have shortened the trace without requiring knowledge of this skill?

If either answer is no, continue the original task without manufacturing cleanup.

Zero repairs is a successful outcome when the trace exposed no real smell. The skill rewards reduced future friction, not visible activity.

## Stay proportional

Do not widen a focused task into an architectural rewrite, add comments everywhere, duplicate facts across documents, preserve temporary task state, create speculative TODOs, or comprehensively document the system. Do not hide behavior changes inside a clarity cleanup.

When the proper repair is too large, risky, or uncertain, do not create a breadcrumb file. State the concrete smell, evidence, and likely repair in the normal handoff so the owner can choose whether to expand scope.

## Reference knowledge

Start at the [reference index](references/index.md), or open only the concept needed:

- [Knowledge smell catalog](references/smells.md). Diagnose the expectation failure and reject false positives.
- [Repair patterns](references/repairs.md). Select the strongest local repair and place knowledge where it naturally belongs.
- [Scope and autonomy rails](references/scope-rails.md). Decide whether to repair now, verify more, or surface the issue.
- [Worked healing examples](references/examples.md). Compare weak breadcrumb-like notes with repairs that change the next trace.
- [Research basis](references/evidence.md). Consult the primary evidence behind information scent, explicit contracts, comments, diagnostics, documentation placement, and decision records.
