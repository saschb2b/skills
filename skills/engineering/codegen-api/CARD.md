---
type: Card
card_version: 0.1
title: codegen-api
target_version: 0.0.0
description: Set up typesafe API code generation in 2026, preferring framework-agnostic options factories over generated hooks. Walks the decision matrix for REST (OpenAPI via hey-api) and GraphQL...
timestamp: "2026-07-26T23:25:01Z"
target_digest: "sha256:19d63bdecd273cb266852f8cae9198a089f8eedddb4a6e565591b7d51c6a7d29"
bom:
  files: 5
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
    - "https://api.example.com/graphql"
    - "https://saschb2b.com/blog/typesafe-api-codegen-2026"
risk_tier: executable-L1
content_provenance:
  applicable: false
attestations: []
expires: 2027-07-27
supersedes: null
---

# codegen-api

Trust card for `codegen-api` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it.

<!--card-data {"type":"Card","card_version":"0.1","title":"codegen-api","target_version":"0.0.0","description":"Set up typesafe API code generation in 2026, preferring framework-agnostic options factories over generated hooks. Walks the decision matrix for REST (OpenAPI via hey-api) and GraphQL...","timestamp":"2026-07-26T23:25:01Z","target_digest":"sha256:19d63bdecd273cb266852f8cae9198a089f8eedddb4a6e565591b7d51c6a7d29","bom":{"files":5,"algorithm":"sha256-manifest"},"identity":"did:web:saschb2b.com","signing":{"scheme":"sigstore-keyless","bundle":"CARD.md.sigstore"},"transparency":{"log":"rekor","stapled":true},"capability":{"model":"executable","manifest_declared":"permissions.yaml","source":"declared","network":"see-manifest","shell":null,"filesystem_writes":null,"network_evidence":[],"shell_evidence":[],"declared_external_sources":["https://api.example.com/graphql","https://saschb2b.com/blog/typesafe-api-codegen-2026"]},"risk_tier":"executable-L1","content_provenance":{"applicable":false},"attestations":[],"expires":"2027-07-27","supersedes":null,"_body":"# codegen-api\n\nTrust card for `codegen-api` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it."} -->
