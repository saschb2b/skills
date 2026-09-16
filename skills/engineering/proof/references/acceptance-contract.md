---
type: Specification
title: Acceptance contract
description: Translate one story into a bounded set of observable obligations before implementation.
tags: [acceptance, requirements, scope]
timestamp: 2026-09-16T00:42:23Z
---

# Reader job

Define what must be true for this story to be accepted, before the builder chooses an implementation. The contract is the normative statement of the story's required behavior. The [gate protocol](./gate.md) supplies its machine-readable representation.

# Derive the contract

Read the story's user, desired capability, and intended benefit. Read the existing behavior and relevant [project policy](./project-policy.md). Preserve what is already agreed. Ask only for missing decisions that could change acceptance, such as a timeout, permission rule, retention period, or required error message. Record unresolved decisions; a draft with an open decision must not be frozen.

| Part | What belongs here | Failure it prevents |
| --- | --- | --- |
| Story identity and outcome | Stable ticket ID or local ID and the user-visible benefit | Implementing a convenient technical task instead of the requested outcome |
| Scope | Surfaces, actors, configurations, and changed behavior | Implicit expansion into adjacent features |
| Non-goals | Specifically excluded changes relevant to this task | Opportunistic redesign or dependency churn |
| Assumptions | Existing facts or explicitly accepted product decisions | Silently invented requirements |
| Criteria | Stable ID and an observable response under stated conditions | Vague claims such as works correctly |
| Checks | Named mechanism, kind, and expected observation | A criterion with no credible way to evaluate it |
| Policy inputs | Exact files whose applicable obligations constrain delivery | Passing story checks while violating the team's DoD |

Use the single JSON block in the Acceptance concept as the executable source of truth. Prose explains decisions and links; it must not quietly override a JSON criterion. Do not maintain an independently edited Markdown criteria table with the same data.

# Shape criteria

Use [EARS](./ears.md) when its patterns clarify a condition and response. One criterion should have a coherent acceptance decision; several tests may support it. Split unrelated outcomes that can fail independently. Preserve IDs when moving tests, and retire IDs rather than reusing them for a different meaning.

Replace “handles errors gracefully” with the agreed observable outcome, for example a named alert and preserved input after a failed save. Do not decide the alert text merely because exact text is easy to assert. If wording is not part of the contract, test the relevant meaning, role, or state.

Functional criteria do not exhaust value. If the story promises a measurable usability or business outcome, distinguish behavior that can be accepted now from a later outcome measurement. Record the latter's population, measurement window, and owner when known. Do not claim that passing a UI test proves conversion, customer satisfaction, or business impact.

# Freeze and revise

Freeze after material decisions and check expectations are resolved. Freezing records exact bytes and policy digests; it is not human approval, and it need not interrupt work already authorized by the user. Keep the baseline available to the verifier independently of the builder's explanation.

A criterion change creates a new revision and fresh verification. A typo also changes an exact-byte digest; either fix it before freezing or re-freeze honestly. Never edit a frozen contract in place and preserve its old acceptance result. Follow the [lifecycle](./lifecycle.md) for amendments and supersession.

# Citations

The [source conversation and design decisions](./sources.md) supply the story-to-contract responsibility. The exact schema and integrity behavior are local protocol decisions, implemented by the [gate](./gate.md).
