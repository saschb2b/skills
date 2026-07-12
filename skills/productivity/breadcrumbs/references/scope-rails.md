---
type: Autonomy Decision Guide
title: Scope and autonomy rails
description: Decide whether an understanding repair is safe to apply now, needs more evidence, or should be surfaced.
tags: [autonomy, risk, verification]
timestamp: 2026-07-12T21:15:00Z
---

# Decide before expanding the diff

The presence of a strong [knowledge smell](/smells.md) does not authorize an unrelated refactor. Use confidence, coupling, reversibility, and verification cost to choose whether to apply a [repair](/repairs.md) now.

# Decision matrix

| Confidence in cause | Repair blast radius | Action |
| --- | --- | --- |
| High | Local, behavior-preserving, easily verified | Repair in the current task. |
| High | Cross-file but mechanical and within the traced feature | Repair if references and focused tests make the change reviewable. |
| High | Public contract, architecture, data, security, or user-visible behavior | Surface the evidence and proposed repair unless the user explicitly authorized that change. |
| Medium | Local and reversible | Gather one more confirming signal; repair only if verification can disprove the diagnosis. |
| Medium | Broad or behavior-changing | Do not fold it into incidental healing. Surface it. |
| Low | Any | Do not encode a guess as code or documentation. Continue the original task and report uncertainty only when useful. |

# In-bounds repairs

Usually apply these without a separate decision when they are directly connected to the trace:

- Correct a demonstrably stale nearby comment or existing documentation claim.
- Improve a local name that is not a public compatibility surface.
- Add safe context to an error without exposing sensitive data.
- Add a focused regression or contract test for behavior already established.
- Tighten validation to produce an earlier equivalent failure, when compatibility is understood.
- Remove an obviously redundant pass-through after references and tests prove it unused.
- Add a concise why comment for a verified external constraint.

# Surface first

Do not hide these inside an incidental clarity repair:

- Public API, wire format, schema, or persistence changes.
- Authentication, authorization, payment, privacy, or production-data behavior.
- Broad module moves, architecture changes, or dependency replacements.
- Renames with external consumers or compatibility requirements.
- Product behavior, user flow, or visible copy changes based on judgment.
- Deletion whose reachability cannot be established.
- Documentation claims you cannot verify from an authoritative source.

Surface the expectation failure, the evidence found, the likely repair, and the risk. Do not create a permanent issue or TODO unless the user or repository workflow calls for one.

Use an existing architecture decision record system only for decisions that affect structure, non-functional characteristics, dependencies, interfaces, or construction techniques. A local naming fix, corrected comment, or ordinary implementation detail does not earn a new ADR. Do not introduce an ADR system as an incidental breadcrumb repair.

# Prevent cleanup drift

Stop the healing branch when any of these becomes true:

- The repair is larger or riskier than the original task and is not required to complete it.
- You are improving nearby style that did not contribute to the trace.
- The proposed abstraction anticipates future use rather than clarifying current behavior.
- You are adding prose because changing the code would be harder, even though the prose will drift.
- You cannot state how the repair will be verified.
- Reviewers would struggle to separate the primary task from the incidental repair.

# Handoff when not repairing

Keep the handoff compact:

```text
Clarity smell: <reasonable expectation that failed>.
Evidence: <symbols, behavior, or documentation that established the mismatch>.
Likely repair: <smallest durable change>.
Why deferred: <specific scope, confidence, or risk boundary>.
```

This is a task handoff, not a new tracking system. Omit it when the observation is weak or unlikely to help the owner.
