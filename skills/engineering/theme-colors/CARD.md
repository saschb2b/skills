---
type: Card
card_version: 0.1
title: theme-colors
target_version: 0.0.0
description: Audit and refactor UI code so every color value comes from the theme. Replace hex codes, rgba(), hsl(), oklch() literals, and named CSS colors with theme palette tokens (primary, secondary, error...
timestamp: "2026-06-29T18:54:52Z"
target_digest: "sha256:8f2c47b14459154c05f9f82ff638864d4273b188fdaa3717529d9988dfdb7d47"
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
    - "https://saschb2b.com/blog/designer-meets-theme"
risk_tier: executable-L1
content_provenance:
  applicable: false
attestations: []
expires: 2027-06-29
supersedes: null
---

# theme-colors

Trust card for `theme-colors` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it.

<!--card-data {"type":"Card","card_version":"0.1","title":"theme-colors","target_version":"0.0.0","description":"Audit and refactor UI code so every color value comes from the theme. Replace hex codes, rgba(), hsl(), oklch() literals, and named CSS colors with theme palette tokens (primary, secondary, error...","timestamp":"2026-06-29T18:54:52Z","target_digest":"sha256:8f2c47b14459154c05f9f82ff638864d4273b188fdaa3717529d9988dfdb7d47","bom":{"files":2,"algorithm":"sha256-manifest"},"identity":"did:web:saschb2b.com","signing":{"scheme":"sigstore-keyless","bundle":"CARD.md.sigstore"},"transparency":{"log":"rekor","stapled":true},"capability":{"model":"executable","manifest_declared":"permissions.yaml","source":"declared","network":"see-manifest","shell":null,"filesystem_writes":null,"network_evidence":[],"shell_evidence":[],"declared_external_sources":["https://saschb2b.com/blog/designer-meets-theme"]},"risk_tier":"executable-L1","content_provenance":{"applicable":false},"attestations":[],"expires":"2027-06-29","supersedes":null,"_body":"# theme-colors\n\nTrust card for `theme-colors` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it."} -->
