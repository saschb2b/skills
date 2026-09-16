---
type: Integration Guide
title: Knowledge placement and OKF integration
description: Discover the project's requirements home and apply OKF within that structure while keeping evidence and trust claims precise.
tags: [okf, provenance, integration]
timestamp: 2026-09-16T00:57:57Z
---

# Place the knowledge

Locate where this project keeps requirements and acceptance knowledge. Read repository instructions, documentation indexes, story links, and nearby policy documents. Identify OKF bundles by their root index metadata (`okf_version`) and typed concepts, wherever they live. A directory's name does not determine its format.

| What exists | Placement decision |
| --- | --- |
| An explicit user-selected contract path | Use that path within the authorized repository |
| A relevant acceptance area in an existing bundle | Add the contract there and maintain its indexes and links |
| A relevant bundle without an acceptance area | Add an acceptance concept or small subsection following that bundle's organization |
| Requirements documentation without an OKF bundle | Put a small acceptance bundle beside those requirements; leave unrelated human documentation in its current format |
| No relevant documentation area | Choose a purpose-named location consistent with repository conventions, such as `docs/acceptance` where that fits; state the choice before writing |

When several bundles exist, choose by the story's product or subsystem, not the first directory found. Ask only if ownership or conflicting instructions make the destination materially ambiguous. Do not create a parallel documentation hierarchy just because an existing directory lacks a familiar name.

Keep the story's ticket URL as provenance; it can remain the team's backlog interface. Pass the resolved contract path explicitly to the [gate CLI](./gate.md). Paths below are roles in the layout, not required directory names:

```text
<existing-requirements-bundle>/
  index.md
  log.md
  <existing-policy>.md            link to the project's actual policy
  acceptance/
    index.md
    STORY-421.md                  Acceptance concept with one JSON contract
  outcomes/
    index.md
    STORY-421-r1.md               optional durable acceptance record
<generated-evidence-root>/
  STORY-421-r1/                   local freeze, verdicts, and evidence
```

If creating a standalone acceptance bundle, its root may directly contain story concepts; do not add a redundant `acceptance/acceptance` level. Reuse the project's generated-output area for runtime records, or use a dedicated `.proof/` directory when no equivalent exists. The [gate protocol](./gate.md) defines artifact paths within the explicitly selected evidence directory. Runtime JSON, logs, and screenshots are not OKF concepts. Put Markdown meant as lasting agent knowledge in a typed concept, rather than filling the evidence directory with untyped knowledge pages.

# Concept responsibilities

| Type chosen by this skill | Content and links |
| --- | --- |
| `Acceptance` | Story intent, one normative JSON contract, link to relevant policy and later outcome |
| `Project Policy` | Existing shared DoD obligations, rationale, applicability |
| `Acceptance Record` | Candidate identity, contract revision, gate result, evidence locations, known limits; links back to acceptance |

These type names and the `proof` JSON schema are producer-defined conventions. They are not claimed as registered OKF standard types or standard verdict fields. Maintain `index.md` navigation and `log.md` history when adding or revising concepts. Add direct concept-to-concept links that explain the relationship. A root index alone does not connect the knowledge graph.

This skill's reference bundle keeps the repository's v0.1 convention: typed Markdown, timestamps, body citations, and a versioned root index. Do not migrate an existing project bundle merely to use proof. Match its declared version and validation tools.

# Separate trust from acceptance

The consulted upstream OKF specification is v0.2. It distinguishes generation from verification, permits human and non-human verification actors, and treats trust fields as advisory rather than access control. Its attested-computation contract describes a sanctioned computation and receipt verification; merely naming a local script does not supply that machinery. [1]

Consequently, a machine verifier may be attributed honestly as a machine. Never write `human:<id>` for an agent's judgment. A project can require human approval for selected criteria without imposing it on all work. Document-level confirmation, execution evidence, and product acceptance are different claims.

The bundled [gate](./gate.md) is local integrity and completeness checking. Do not label its output a verified OKF attestation or claim that file hashes authenticate the verifier. If a project needs stronger enforcement, put the approved gate and baseline in protected CI, restrict who may replace them, and retain independently sourced run records.

# Citations

[1] [OKF specification, v0.2](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md), consulted 2026-09-16, sections 4, 5.2, 5.3, 7, and 10. The [source ledger](./sources.md) distinguishes these upstream facts from the local profile and the original conversation's assumptions.
