---
type: Reference
title: Source inventory and design decisions
description: Trace the proof skill to the supplied conversation and primary sources while recording corrections and scope.
resource: https://claude.ai/share/33e7432f-0d4a-4f8a-8e5a-6d7237efef02
tags: [sources, provenance, design]
timestamp: 2026-09-16T00:42:23Z
---

# Source scope

The supplied Claude conversation was read in full through its public share page on 2026-09-16. It develops the missing step between a Scrum story and demonstrated delivery. This bundle transforms that bounded conversation and checks relevant factual claims; it is not an export of the entire Claude site or of every specification tool mentioned.

# Conversation coverage

| Source unit | Disposition |
| --- | --- |
| Recalling declarative specification taught at university | [EARS](./ears.md); historical certainty about which course the user took is not asserted |
| Agent-first tasks with verifiable completion | [Acceptance contract](./acceptance-contract.md) and [verification](./verification.md) |
| WHEN, IF, WHERE, WHILE, THEN as remembered patterns | [EARS](./ears.md), correcting the one-keyword-one-test interpretation |
| Existing Playwright makes another framework unnecessary | [Verification](./verification.md), preserving native test tools |
| Keep Scrum, sprints, and stories; identify X | [Acceptance contract](./acceptance-contract.md) and [project policy](./project-policy.md) |
| Where X lives and how it grows | [OKF placement](./okf-profile.md) and [lifecycle](./lifecycle.md) |
| Skill owns transformation, loop, and responsibility | Thin skill entrypoint plus [gate](./gate.md) |
| Frozen criteria, graded evidence, independent verifier | [Verification](./verification.md), [lifecycle](./lifecycle.md), and executable gate |

# Corrections and deliberate choices

- EARS offers structured requirement patterns. This skill does not assert that it is a universal industry standard, that each word denotes a test, or that it identifies the user's remembered university course with certainty.
- The exact number of criteria is determined by the story. The conversation's suggested three-to-eight range is not a requirement.
- Independent verification improves separation of responsibilities but does not make an incorrect specification correct. The gate checks evidence bookkeeping and declared results; it is not a mathematical proof of user value.
- The upstream OKF v0.2 document allows non-human verification. The conversation's claim that `verified` is exclusively human is not retained.
- A local script is replaceable by anyone with write access. Strong enforcement needs protected execution and authoritative records; this implementation does not advertise an unbypassable gate or attestation.
- Human review is required when the actual contract or project policy requires it. Freezing and existing user authorization do not imply a new approval gate for all stories.
- Contracts stay at stable paths by default. Archiving into a new directory is optional, not the sole retention scheme.
- `proof` is an independent skill. Existing `autopilot`, `to-story`, and `trust-card` behavior is not changed.

# Primary sources

| Source | Supported claims and offline home |
| --- | --- |
| [Mavin's EARS guide](https://alistairmavin.com/ears/) | Pattern meanings and clause order, captured with authored examples in [EARS](./ears.md) |
| [Playwright annotations](https://playwright.dev/docs/test-annotations) | Tags and grep-based selection, applied in [verification](./verification.md) |
| [Playwright reporters](https://playwright.dev/docs/test-reporters) | Structured execution reports, applied in [verification](./verification.md) |
| [Scrum Guide](https://scrumguides.org/scrum-guide.html) | Definition of Done responsibility, captured in [project policy](./project-policy.md) |
| [OKF v0.2 specification](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md) | Type extensibility and trust distinctions, captured in [OKF placement](./okf-profile.md) |

All sources were consulted on 2026-09-16. The contract schema, gate CLI, local directory convention, repair policy, and examples are authored design decisions for this skill, not facts attributed to those sources.

# Entity boundary

EARS has its own [method concept](./ears.md). Scrum and Definition of Done are explained in [project policy](./project-policy.md); Playwright and Storybook's role are explained in [verification](./verification.md); OKF trust and attestation are explained in [OKF placement](./okf-profile.md). Builder, verifier, gate, contract, and evidence are defined in their linked workflow concepts.

Z, VDM, B/Event-B, TLA+, Alloy, OCL, requirements-document standards, OpenSpec, Spec Kit, Kiro, and Proof Loop were background comparisons in the conversation. They are not dependencies of this skill, and their product claims were not imported. No broader tool survey, claims of community consensus, or formal verification implementation is implied.
