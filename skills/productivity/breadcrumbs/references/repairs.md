---
type: Repair Pattern Catalog
title: Repair patterns
description: Durable transformations that reduce future tracing without creating a separate knowledge system.
tags: [maintainability, refactoring, documentation]
generated: { by: claude-code/unversioned, at: 2026-07-12T21:15:00Z }
---

# Contents

- [Select the repair](#select-the-repair)
- [Replace a misleading name](#replace-a-misleading-name)
- [Turn an implicit contract into an executable one](#turn-an-implicit-contract-into-an-executable-one)
- [Preserve a non-obvious why](#preserve-a-non-obvious-why)
- [Collapse competing sources of truth](#collapse-competing-sources-of-truth)
- [Move diagnosis toward the cause](#move-diagnosis-toward-the-cause)
- [Remove a dead end](#remove-a-dead-end)
- [Put knowledge in its natural home](#put-knowledge-in-its-natural-home)
- [Verify by repair type](#verify-by-repair-type)

# Select the repair

Start with the diagnosed [knowledge smell](/smells.md). Choose the strongest form that removes the expectation gap without exceeding the [scope rails](/scope-rails.md). A repair should help through normal code reading, execution, failure, or existing documentation discovery. See the [research basis](/evidence.md) for the evidence behind the hierarchy.

# Pattern catalog

## Replace a misleading name

Use when a symbol, file, configuration key, or module implies the wrong behavior or owner.

- Name the actual responsibility, unit, direction, or lifecycle.
- Update references atomically and search for prose using the old term.
- Preserve a public alias only when compatibility requires it; mark the canonical name clearly.
- Avoid renaming for tone or personal taste when the old name is accurate.

Example: rename `analyticsTimeout` to `checkoutRetryDelayMs` and place it with checkout configuration when checkout owns the behavior.

## Turn an implicit contract into an executable one

Use when the trace had to infer a precondition from callers or failure behavior.

| Hidden fact | Strong repair |
| --- | --- |
| Must run inside a transaction | Require a transaction handle, expose a transaction-scoped API, or assert the context at the boundary. |
| Input uses milliseconds | Encode the unit in the type or name and validate its range. |
| A field is conditionally required | Model the states as a discriminated type or validate the condition together. |
| Call order matters | Expose state-specific operations or reject invalid transitions where they occur. |
| Only one combination is supported | Narrow the public interface and add a representative contract test. |

A docstring can supplement an executable contract, but should not be the only enforcement when invalid use can be detected.

Think in obligations and guarantees:

- A precondition states what the caller must provide.
- A postcondition states what successful execution guarantees.
- An invariant states what remains true across operations or states.

Use the language's strongest idiomatic mechanism rather than imitating a particular contract syntax. Types, constructors, schemas, validation, assertions, state machines, and tests can all carry parts of the contract.

## Preserve a non-obvious why

Use when code must remain surprising because of an external or historical constraint.

A useful adjacent comment states:

1. The constraint, not a narration of the code.
2. The consequence of removing or simplifying the workaround.
3. A stable issue, test, specification, or upstream reference when one exists.

Pair the comment with a regression test when the constraint is behaviorally testable. Do not add dates, authors, or removal promises that cannot be maintained.

Treat attention as a budget. Comments redirect readers' attention and can either help or hinder comprehension depending on their quality and context. Add one only when it supplies a relevant fact the code cannot communicate clearly; delete it when it merely competes with the code.

## Collapse competing sources of truth

Use when multiple values or documents appear authoritative.

- Choose one owner and derive other representations from it.
- Replace copied constants with imports, generated output, or a shared schema when coupling is appropriate.
- State precedence at the boundary when consolidation is impossible.
- Delete or clearly label obsolete copies; leaving both in place preserves the smell.

## Move diagnosis toward the cause

Use when a failure message exposes only a downstream symptom.

- Validate at the earliest boundary that has enough context to explain the problem.
- Include the operation, relevant target or field, expected condition, and safe actual state.
- Preserve the original cause when wrapping an exception.
- Prefer structured, machine-inspectable details when callers or tools need to react differently.
- Suggest remediation only when it is reliable.
- Never add secrets, tokens, personal data, or unbounded payloads to diagnostics.

## Remove a dead end

Use when obsolete code, compatibility paths, or pass-through abstractions prolonged the trace.

Prove reachability before deletion with references, tests, runtime registration, configuration, and generated use as appropriate. If deletion is unsafe, make the canonical entry point visible and state the live constraint at the dead end.

# Put knowledge in its natural home

| Knowledge | Natural home |
| --- | --- |
| Behavior and ownership | Names, structure, module boundaries, and APIs |
| Preconditions and invariants | Types, schemas, validation, assertions, and contract tests |
| Failure cause and recovery hint | Error boundary, command output, or structured logs |
| Reason for surprising local code | Short adjacent why comment plus a stable test or reference |
| Supported usage | Focused tests, API examples, or existing developer documentation |
| Installation and local setup | Existing README, contributor guide, or command help |
| Repository-wide agent commands and conventions | Existing `AGENTS.md`, `CLAUDE.md`, or equivalent instruction file |
| Cross-module architecture | Existing architecture documentation, module overview, or top-level entry point |
| Significant architectural choice and its tradeoffs | Existing decision-record system, using context, decision, status, and consequences |
| Deployment and incident recovery | Existing runbook or operational documentation |

Do not create a `breadcrumbs.md` file in the target project. This skill's own OKF references are a shipped decision aid, not a documentation architecture it imposes on repositories.

When adding to existing documentation, match the reader's need:

| Reader need | Documentation form |
| --- | --- |
| Learn through a guided experience | Tutorial |
| Complete a real task or recover from a problem | How-to guide or runbook |
| Look up accurate facts, parameters, or structure | Reference |
| Understand context, tradeoffs, or why | Explanation or an existing decision record when architecturally significant |

Do not mix all four into one incidental addition. Patch the existing surface of the right kind, or link between existing surfaces when both action and explanation are needed.

# Verify by repair type

| Repair | Minimum useful verification |
| --- | --- |
| Rename or move | Reference search plus relevant build or type check |
| Contract encoding | Positive and invalid-case tests or schema validation |
| Error improvement | Trigger the failure and inspect the safe diagnostic output |
| Comment or rationale | Confirm the code and cited constraint still support the claim |
| Documentation correction | Search for contradictory copies and run available docs checks |
| Simplification or deletion | Characterization tests plus reference and registration search |

Verification should match the actual risk. Do not run an entire platform test suite for a local prose correction unless repository policy requires it.
