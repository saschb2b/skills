---
type: Card
card_version: 0.1
title: autopilot
target_version: 0.0.0
description: Work autonomously on a project without waiting for direction. On command, survey the codebase, pick one high-value low-risk improvement, do it, verify it, commit it, then pick the next, looping like...
timestamp: "2026-06-29T18:54:52Z"
target_digest: "sha256:ddf3683f9ad619f8b23bf76d1b71a02903489021917ba2531c0834b1ce879fd8"
bom:
  files: 2
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
  network_evidence: []
  shell_evidence: []
  declared_external_sources: []
risk_tier: executable-L1
content_provenance:
  applicable: false
attestations: []
expires: 2027-06-29
supersedes: null
---

# autopilot

Trust card for `autopilot` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it.

<!--card-data {"type":"Card","card_version":"0.1","title":"autopilot","target_version":"0.0.0","description":"Work autonomously on a project without waiting for direction. On command, survey the codebase, pick one high-value low-risk improvement, do it, verify it, commit it, then pick the next, looping like...","timestamp":"2026-06-29T18:54:52Z","target_digest":"sha256:ddf3683f9ad619f8b23bf76d1b71a02903489021917ba2531c0834b1ce879fd8","bom":{"files":2,"algorithm":"sha256-manifest"},"identity":"did:web:saschb2b.com","signing":{"scheme":"sigstore-keyless","bundle":"CARD.md.sigstore"},"transparency":{"log":"rekor","stapled":true},"capability":{"model":"executable","manifest_declared":"permissions.yaml","source":"declared","network":"see-manifest","shell":null,"filesystem_writes":null,"network_evidence":[],"shell_evidence":[],"declared_external_sources":[]},"risk_tier":"executable-L1","content_provenance":{"applicable":false},"attestations":[],"expires":"2027-06-29","supersedes":null,"_body":"# autopilot\n\nTrust card for `autopilot` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it."} -->
