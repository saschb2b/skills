---
type: Card
card_version: 0.1
title: audit-actions
target_version: 0.0.0
description: Audit a repository's GitHub Actions workflows for unsafe pull_request_target usage that can lead to supply chain compromise. Use when the user asks to audit workflows, review CI/CD security, check...
timestamp: "2026-06-29T18:54:51Z"
target_digest: "sha256:d8ac9d1ac04b2df935c1f558e21f843274f0ddf5398f6fa7cb4a85f5d8191201"
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
  declared_external_sources:
    - "https://saschb2b.com/blog/pull-request-target-trap"
risk_tier: executable-L1
content_provenance:
  applicable: false
attestations: []
expires: 2027-06-29
supersedes: null
---

# audit-actions

Trust card for `audit-actions` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it.

<!--card-data {"type":"Card","card_version":"0.1","title":"audit-actions","target_version":"0.0.0","description":"Audit a repository's GitHub Actions workflows for unsafe pull_request_target usage that can lead to supply chain compromise. Use when the user asks to audit workflows, review CI/CD security, check...","timestamp":"2026-06-29T18:54:51Z","target_digest":"sha256:d8ac9d1ac04b2df935c1f558e21f843274f0ddf5398f6fa7cb4a85f5d8191201","bom":{"files":2,"algorithm":"sha256-manifest"},"identity":"did:web:saschb2b.com","signing":{"scheme":"sigstore-keyless","bundle":"CARD.md.sigstore"},"transparency":{"log":"rekor","stapled":true},"capability":{"model":"executable","manifest_declared":"permissions.yaml","source":"declared","network":"see-manifest","shell":null,"filesystem_writes":null,"network_evidence":[],"shell_evidence":[],"declared_external_sources":["https://saschb2b.com/blog/pull-request-target-trap"]},"risk_tier":"executable-L1","content_provenance":{"applicable":false},"attestations":[],"expires":"2027-06-29","supersedes":null,"_body":"# audit-actions\n\nTrust card for `audit-actions` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it."} -->
