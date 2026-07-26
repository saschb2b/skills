---
type: Card
card_version: 0.1
title: trust-card
target_version: 0.0.0
description: Generate, sign, attest, and verify holistic trust cards for OKF knowledge bundles and agent skills. A card binds content, artifact, and capability provenance into one OKF concept and renders a graded...
timestamp: "2026-07-26T23:25:03Z"
target_digest: "sha256:47eac9b761bed93fe19ea5183264d9684996e0bd0e1cc2ec3152c1016b2fd6a2"
bom:
  files: 8
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
    - scripts\card.py
  shell_evidence:
    - scripts\card.py
  declared_external_sources: []
risk_tier: executable-L1
content_provenance:
  applicable: false
attestations: []
expires: 2027-07-27
supersedes: null
---

# trust-card

Trust card for `trust-card` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it.

<!--card-data {"type":"Card","card_version":"0.1","title":"trust-card","target_version":"0.0.0","description":"Generate, sign, attest, and verify holistic trust cards for OKF knowledge bundles and agent skills. A card binds content, artifact, and capability provenance into one OKF concept and renders a graded...","timestamp":"2026-07-26T23:25:03Z","target_digest":"sha256:47eac9b761bed93fe19ea5183264d9684996e0bd0e1cc2ec3152c1016b2fd6a2","bom":{"files":8,"algorithm":"sha256-manifest"},"identity":"did:web:saschb2b.com","signing":null,"transparency":null,"capability":{"model":"executable","manifest_declared":"permissions.yaml","source":"declared","network":"see-manifest","shell":null,"filesystem_writes":null,"network_evidence":["scripts\\card.py"],"shell_evidence":["scripts\\card.py"],"declared_external_sources":[]},"risk_tier":"executable-L1","content_provenance":{"applicable":false},"attestations":[],"expires":"2027-07-27","supersedes":null,"_body":"# trust-card\n\nTrust card for `trust-card` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it."} -->
