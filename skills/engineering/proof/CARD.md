---
type: Card
card_version: 0.1
title: proof
target_version: 0.0.0
description: Carry a given story to evidence-backed completion through a frozen acceptance contract, independent verification, and a deterministic completion gate. Use when turning a story into checkable...
timestamp: "2026-09-16T00:57:58Z"
target_digest: "sha256:33af59d6d6cd026a296cb4cb77cab102df13ec16677e024f10035d3f73d330b0"
bom:
  files: 16
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
  network_evidence: []
  shell_evidence:
    - scripts\proof_gate.py
    - scripts\test_proof_gate.py
  declared_external_sources:
    - "https://alistairmavin.com/ears/"
    - "https://claude.ai/share/33e7432f-0d4a-4f8a-8e5a-6d7237efef02"
    - "https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md"
    - "https://github.com/microsoft/playwright/blob/main/packages/playwright-test/package.json"
    - "https://playwright.dev/docs/test-annotations"
    - "https://playwright.dev/docs/test-reporters"
    - "https://scrumguides.org/scrum-guide.html"
    - "https://scrumguides.org/scrum-guide.html#commitment-definition-of-done"
risk_tier: executable-L1
content_provenance:
  applicable: false
attestations: []
expires: 2027-09-16
supersedes: null
---

# proof

Trust card for `proof` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it.

<!--card-data {"type":"Card","card_version":"0.1","title":"proof","target_version":"0.0.0","description":"Carry a given story to evidence-backed completion through a frozen acceptance contract, independent verification, and a deterministic completion gate. Use when turning a story into checkable...","timestamp":"2026-09-16T00:57:58Z","target_digest":"sha256:33af59d6d6cd026a296cb4cb77cab102df13ec16677e024f10035d3f73d330b0","bom":{"files":16,"algorithm":"sha256-manifest"},"identity":"did:web:saschb2b.com","signing":null,"transparency":null,"capability":{"model":"executable","manifest_declared":"permissions.yaml","source":"declared","network":"see-manifest","shell":null,"filesystem_writes":null,"network_evidence":[],"shell_evidence":["scripts\\proof_gate.py","scripts\\test_proof_gate.py"],"declared_external_sources":["https://alistairmavin.com/ears/","https://claude.ai/share/33e7432f-0d4a-4f8a-8e5a-6d7237efef02","https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md","https://github.com/microsoft/playwright/blob/main/packages/playwright-test/package.json","https://playwright.dev/docs/test-annotations","https://playwright.dev/docs/test-reporters","https://scrumguides.org/scrum-guide.html","https://scrumguides.org/scrum-guide.html#commitment-definition-of-done"]},"risk_tier":"executable-L1","content_provenance":{"applicable":false},"attestations":[],"expires":"2027-09-16","supersedes":null,"_body":"# proof\n\nTrust card for `proof` (skill). Evidence is graded by the consumer, not asserted here. Run `card.py verify` against the live bundle to evaluate it."} -->
