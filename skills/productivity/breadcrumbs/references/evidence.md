---
type: Research Synthesis
title: Research basis for self-healing traces
description: Primary evidence and authoritative engineering guidance translated into bounded rules for the breadcrumbs skill.
tags: [program-comprehension, research, maintainability]
timestamp: 2026-07-12T21:15:00Z
---

# Use evidence without turning it into dogma

These sources support the skill's direction, but none supplies a universal code-quality formula. Apply the operational rule under each finding, then use the [smell catalog](/smells.md), [repair patterns](/repairs.md), and [scope rails](/scope-rails.md) to judge the actual repository.

# Programmer navigation follows available cues

An empirical study of professional programmers debugging a real open-source system modeled navigation using information scent and topology. A model using scent predicted navigation better than comparison models that omitted it. The actionable unit is environmental: words, symbols, links, and available navigation edges influence where a programmer looks next.

**Skill rule:** Treat repeated plausible wrong turns and missing navigable edges as evidence about the codebase. Improve the cue or edge that caused the route. Do not preserve the full investigation transcript.

# Explanations should improve the artifact

Google's engineering guidance says that when a reviewer needs an explanation, the usual response should be clearer code, with a code comment used when simplification cannot carry the missing reason. An explanation left only in review discussion does not help future readers.

**Skill rule:** Move durable understanding into code, executable constraints, or the nearest appropriate maintained surface. Do not count a chat, review comment, or handoff alone as healing when a safe local repair is available.

# Comments are contextual, not automatically beneficial

A 2025 eye-tracking study found that comments redirected substantial visual attention, but their effect on comprehension varied by snippet: some helped, some hurt, and usefulness depended on quality and context. The study and its reviewed prior work also report that identifiers can matter more than comments in small tasks.

**Skill rule:** Spend reader attention deliberately. Prefer accurate names and structure for what the code does. Add comments for relevant intent, rationale, constraints, or domain context that the code cannot express; do not add comment volume as a proxy for clarity.

# Contracts make obligations and guarantees explicit

Bertrand Meyer's Design by Contract distinguishes preconditions, postconditions, and invariants as explicit obligations and guarantees around operations and types.

**Skill rule:** When the trace uncovers a hidden precondition, promised result, or invariant, encode it with the strongest idiomatic mechanism available: types, schemas, constructors, validation, assertions, state-specific APIs, or tests. Prose may supplement the contract but should not be its only carrier when invalid use is detectable.

# Diagnostic context must survive distance

The Go project's `PathError` example carries the operation, path, and underlying cause, remaining useful even when displayed far from the failing call. Rich error types also let callers inspect details rather than parse prose.

**Skill rule:** Move diagnosis toward the earliest boundary with enough context. Preserve the cause and add safe operation, target, expectation, and structured details that remain useful to both people and tools.

# Documentation form should match the reader's need

Diátaxis separates tutorials, how-to guides, reference, and explanation because they answer different needs. It recommends that reference structure mirror the thing described and that explanation carry context and why.

**Skill rule:** Put procedures in an existing how-to or runbook, lookup facts in reference, and rationale in explanation. Do not append every discovery to one mixed notes page.

# Decision records have a significance threshold

Michael Nygard's original ADR guidance limits records to architecturally significant decisions affecting structure, non-functional characteristics, dependencies, interfaces, or construction techniques. The lightweight record captures context, decision, status, and consequences.

**Skill rule:** Use the repository's existing decision-record system for significant cross-cutting rationale. Use a local comment, contract, test, or existing module documentation for smaller facts. Never introduce an ADR system merely because a trace was difficult.

# Citations

1. [An Information Foraging Theory of How Programmers Debug in an Integrated Development Environment](https://web.engr.oregonstate.edu/~burnett/Reprints/TSE-IFT-2013-asprinted.pdf), IEEE Transactions on Software Engineering.
2. [How to write code review comments](https://google.github.io/eng-practices/review/reviewer/comments.html), Google Engineering Practices.
3. [The Effect of Comments on Program Comprehension: An Eye-tracking Study](https://link.springer.com/article/10.1007/s10664-025-10721-2), Empirical Software Engineering.
4. [Design by Contract](https://se.inf.ethz.ch/~meyer/publications/old/dbc_chapter.pdf), Bertrand Meyer.
5. [Effective Go, Errors](https://go.dev/doc/effective_go#errors), The Go Project.
6. [Diátaxis in five minutes](https://diataxis.fr/start-here/), Daniele Procida.
7. [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), Michael Nygard.
