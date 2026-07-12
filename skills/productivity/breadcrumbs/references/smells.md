---
type: Knowledge Smell Catalog
title: Knowledge smell catalog
description: Observable expectation failures that reveal avoidable codebase understanding friction.
tags: [maintainability, diagnosis, documentation]
timestamp: 2026-07-12T21:15:00Z
---

# Diagnose the friction

A knowledge smell is not merely something the agent did not know. It is a repeatable mismatch between a reasonable expectation and the way the codebase communicates its behavior, ownership, constraints, or rationale.

Use the expectation failure and the navigation trace as evidence. Identify what a competent newcomer would infer, what is actually true, and which codebase feature created the gap. Then choose a repair from [repair patterns](/repairs.md) within the [scope rails](/scope-rails.md). The [research basis](/evidence.md) explains why cues and navigation topology are useful observable signals.

# Read the shape of the trace

Do not preserve the trace as an artifact. Use its shape briefly before it disappears:

- Repeatedly following plausible names into the wrong subsystem indicates weak or misleading information scent.
- Returning to the same hub because related elements have no visible connection indicates hostile navigation topology.
- Inspecting many callers to infer one precondition indicates a hidden contract.
- Reaching the root cause only after an uninformative downstream failure indicates diagnostic opacity.
- Comparing several apparently authoritative values indicates fragmented ownership.

These are diagnostic observations, not thresholds. One wrong turn is ordinary investigation; a repeatable route created by names, structure, links, or errors is a smell.

# Catalog

| Smell | What you notice while tracing | Likely cause | Preferred direction |
| --- | --- | --- | --- |
| Misleading information scent | "The name or location sent me somewhere irrelevant." | Naming, placement, exports, or module ownership imply the wrong responsibility. | Rename, relocate, add a clearer entry point, or remove a misleading indirection. |
| Hostile navigation topology | "I kept returning to the same hub or manually jumping between layers." | Related code has no canonical entry point, visible edge, or navigable boundary. | Expose the canonical path, add an appropriate code-level edge, or improve the nearest existing module overview. |
| Hidden contract | "I had to read every caller to learn the precondition." | Required state, ordering, nullability, transaction context, units, or accepted input is implicit. | Encode the contract in the API, type system, validation, assertion, or focused test. |
| Invisible rationale | "This looks wrong, but changing it breaks something non-obvious." | A workaround, compatibility constraint, performance tradeoff, or business rule has no local explanation. | Simplify if possible; otherwise preserve the why beside the code and cover the constraint. |
| Fragmented ownership | "Several files look authoritative and I cannot tell which wins." | Duplicated configuration, derived values stored independently, or unclear precedence. | Establish one source of truth or make ownership and derivation explicit. |
| Diagnostic opacity | "The failure told me where it surfaced, not what caused it." | Errors omit field, operation, dependency, state, or remediation context. | Improve the error boundary, structured context, or validation location without leaking sensitive data. |
| Stale guidance | "The docs or comment confidently describe behavior that no longer exists." | Documentation drift, obsolete examples, copied comments, or renamed configuration. | Correct or delete the stale claim and search for its duplicates. |
| Missing operational knowledge | "The system only works if you know this setup or recovery step." | Environment, migration, deployment, debugging, or recovery knowledge lives only in memory. | Add it to the existing setup guide, runbook, command help, or failure message. |
| Accidental complexity | "The trace crossed more layers than the behavior justifies." | Pass-through wrappers, premature abstractions, dead compatibility paths, or indirect control flow. | Remove a layer, expose the canonical path, or delete dead code after proving it is unused. |
| Example dependency | "Only one caller or test shows how this is meant to be used." | The public shape is broad while the supported usage is narrow or subtle. | Tighten the interface or promote the representative case into a focused test or existing example. |
| Generated-source trap | "The obvious file is generated, so a direct fix will be overwritten." | Ownership lies in a generator, schema, template, or upstream artifact. | Repair the source generator, wrapper, generation notice, or adjacent contributor guidance. |

# Reject false positives

Do not heal merely because:

- The domain is genuinely complex but accurately modeled.
- The answer appears immediately in a well-named symbol or one obvious search.
- You skipped existing repository guidance that already answers the question.
- The confusion depends on personal stylistic preference rather than a false inference.
- A one-off debugging path would not be useful to another developer.
- The proposed change would trade a familiar project convention for your preferred convention.

# Strength signals

A smell is strong when several of these hold:

- The initial inference was reasonable from names, placement, types, or documentation.
- Multiple files or callers were required only to uncover a simple fact.
- Existing code states mutually inconsistent answers.
- The missing fact is a precondition, invariant, ownership rule, or operational requirement.
- A misleading error or dead path materially extended diagnosis.
- The same confusion has appeared in prior issues, comments, tests, or team notes.

One strong signal can be enough. The list is evidence, not a scoring system.
