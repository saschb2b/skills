---
type: Card
card_version: 0.1
title: trust-card
target_version: 0.0.0
description: Generate, sign, attest, and verify holistic trust cards for OKF knowledge bundles and agent skills. A card binds content, artifact, and capability provenance into one OKF concept and renders a graded...
timestamp: "2026-08-06T23:07:38Z"
target_digest: "sha256:1856e0cb89180df6f49c7d777e80ac05502884ac1e639965727d4c850b94b801"
bom:
  files: 9
  algorithm: sha256-manifest
identity: "did:web:saschb2b.com"
signing:
  scheme: sigstore-keyless
  bundle: CARD.md.sigstore
transparency:
  log: rekor
  stapled: true
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
expires: 2027-07-27
supersedes: null
---

# trust-card

Trust card for `trust-card` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it.

<!--card-data {"type":"Card","card_version":"0.1","title":"trust-card","target_version":"0.0.0","description":"Generate, sign, attest, and verify holistic trust cards for OKF knowledge bundles and agent skills. A card binds content, artifact, and capability provenance into one OKF concept and renders a graded...","timestamp":"2026-08-06T23:07:38Z","target_digest":"sha256:1856e0cb89180df6f49c7d777e80ac05502884ac1e639965727d4c850b94b801","bom":{"files":9,"algorithm":"sha256-manifest"},"identity":"did:web:saschb2b.com","signing":{"scheme":"sigstore-keyless","bundle":"CARD.md.sigstore"},"transparency":{"log":"rekor","stapled":true},"capability":{"model":"executable","manifest_declared":"permissions.yaml","source":"declared","network":"see-manifest","shell":null,"filesystem_writes":null,"network_evidence":["scripts/card.py"],"shell_evidence":["scripts/card.py"],"declared_external_sources":[]},"risk_tier":"executable-L1","content_provenance":{"applicable":false},"attestations":[],"expires":"2027-07-27","supersedes":null,"_body":"# trust-card\n\nTrust card for `trust-card` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it."} -->
