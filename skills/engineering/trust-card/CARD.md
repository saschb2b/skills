---
type: Card
card_version: 0.1
title: trust-card
target_version: 0.0.0
description: Generate, sign, attest, and verify holistic trust cards for OKF knowledge bundles and agent skills. A card binds content, artifact, and capability provenance into one OKF concept and renders a graded...
timestamp: "2026-06-29T18:54:52Z"
target_digest: "sha256:59d66cbf98a4fadadde93b548310c5d102110e74639d0b819b9f05e5e93e5470"
bom:
  files: 7
  algorithm: sha256-manifest
identity: "did:web:saschb2b.com"
signing: null
transparency: null
capability:
  model: executable
  manifest_declared: permissions.yaml
  source: declared
  network: see-manifest
  shell: null
  filesystem_writes: null
  network_evidence:
    - scripts/card.py
  shell_evidence:
    - scripts/card.py
  declared_external_sources: []
risk_tier: executable-L1
content_provenance:
  applicable: false
attestations: []
expires: 2027-06-29
supersedes: null
---

# trust-card

Trust card for `trust-card` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it.

<!--card-data {"type":"Card","card_version":"0.1","title":"trust-card","target_version":"0.0.0","description":"Generate, sign, attest, and verify holistic trust cards for OKF knowledge bundles and agent skills. A card binds content, artifact, and capability provenance into one OKF concept and renders a graded...","timestamp":"2026-06-29T18:54:52Z","target_digest":"sha256:59d66cbf98a4fadadde93b548310c5d102110e74639d0b819b9f05e5e93e5470","bom":{"files":7,"algorithm":"sha256-manifest"},"identity":"did:web:saschb2b.com","signing":null,"transparency":null,"capability":{"model":"executable","manifest_declared":"permissions.yaml","source":"declared","network":"see-manifest","shell":null,"filesystem_writes":null,"network_evidence":["scripts/card.py"],"shell_evidence":["scripts/card.py"],"declared_external_sources":[]},"risk_tier":"executable-L1","content_provenance":{"applicable":false},"attestations":[],"expires":"2027-06-29","supersedes":null,"_body":"# trust-card\n\nTrust card for `trust-card` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it."} -->
