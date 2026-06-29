---
type: Card                       # the single OKF conformance rule
card_version: "0.1"
title: <bundle or skill name>
target_version: <version>
description: <one line>
timestamp: <UTC ISO8601>

# --- layer 1: integrity (always solved) -------------------------------------
target_digest: sha256:<manifest digest binding these exact bytes>
bom:
  files: <N>
  algorithm: sha256-manifest

# --- layers 2-3: artifact provenance (filled by `sign`) ---------------------
identity: did:web:<who>          # self-asserted until anchored to OIDC
signing: null                    # ed25519 {...} or sigstore-keyless {...}
transparency: null               # rekor entry when keyless signing is used

# --- layer 5: capability provenance -----------------------------------------
# knowledge bundle  -> epistemic (executes nothing; risk is contextual)
# executable skill  -> declared manifest, or inferred-and-flagged
capability:
  model: epistemic | executable
  executes: false                # okf bundles
  injects_concepts: <N>
  asserts_over: [<regulated domains>]
  # skill variant: manifest_declared / network / shell / filesystem_writes
risk_tier: epistemic-L0..L2 | executable-L1 | executable-L2-unverified

# --- content provenance (OKF-native) ----------------------------------------
content_provenance:
  applicable: true
  concepts_with_citations: <N>
  reference_concepts_dated: <N>

# --- layer 8: independent evidence (filled by `attest`) ---------------------
attestations: []                 # [{kind, by, result, at_digest, timestamp}]

# --- layer 9: freshness -----------------------------------------------------
expires: <date or null>
supersedes: sha256:<prev digest or null>
---

# <title>

Trust card. Evidence is graded by the consumer, not asserted here. Run
`card.py verify --bundle <dir>` against the live bundle to evaluate it.

<!-- card.py also embeds a compact machine-readable <!--card-data {...}--> block
     below the body for lossless round-tripping; do not hand-edit it. -->
