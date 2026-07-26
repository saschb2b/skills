---
type: Layer Reference
title: "Card layers"
description: "What each trust layer proves, its mechanism and trust anchor, what the script covers today, and the hard limit that crypto certifies origin not behavior."
tags: [trust, provenance, security, okf]
generated: { by: claude-code/unversioned, at: 2026-06-29T00:00:00Z }
---

# Card layers

Each layer answers a different question, is checked by a different verifier, and
rests on a different trust anchor. The card keeps them **separable** — collapsing
them into one badge throws away the information a consumer needs.

| # | Layer | Answers | Mechanism | Trust anchor | Status |
|---|-------|---------|-----------|--------------|--------|
| 0 | Face | What is this? | name/version/type/description | none (informational) | solved |
| 1 | Integrity | Unchanged since published? | sha256 manifest digest | math | solved |
| 2 | Authorship | From the claimed author? | ed25519 / Sigstore keyless over the digest | OIDC identity / signer key | solved |
| 3 | Transparency | Publicly logged, non-equivocable? | Rekor / Merkle transparency log | log + witnesses | solved (Sigstore) |
| 4 | Composition (BOM) | What's inside? | file manifest, deps pinned to hashes | math | solved |
| 5 | Capability (declared) | What can it do? | permission manifest (skill) / epistemic scope (okf) | the declaration | partial |
| 6 | Enforcement | Is the declaration *true*? | kernel sandbox (Landlock/seccomp/bwrap/Seatbelt) | the OS kernel | engineering |
| 7 | Behavior (observed) | Does it match the declaration? | declared-vs-observed in a sandbox (G1–G4 gates) | the sandbox + checks | open (approximate) |
| 8 | Vouching | Who independently audited it? | signed attestations (scan / review / repro build) | each attester's identity | format solved, social layer open |
| 9 | Freshness | Still current, not revoked? | expiry / revocation / supersession (TUF) | the revocation source | solved, needs wiring |

## What this script covers today

- Layers **0, 1, 4**: fully (digest + manifest + face).
- Layer **2**: local ed25519 always; Sigstore keyless if `cosign` is on PATH. `verify` re-checks the signature rather than trusting it (`cosign verify-blob` for keyless, in-process for ed25519), so authorship is earned; without `cosign` a recorded keyless signature drops to MEDIUM.
- Layer **3**: recorded when cosign keyless is used (Rekor entry stapled);
  otherwise marked absent.
- Layer **5**: epistemic capability for OKF bundles (executes/injects/asserts-
  over); for skills it parses a declared manifest if present, else **infers**
  shell/network from the code and flags it as inferred.
- Layer **8**: attestation hooks (`attest` command), graded by how many are
  bound to the current digest.
- Layer **9**: expiry + supersession fields.

## What this script deliberately does NOT do

- Layers **6 and 7** (enforcement and observed behavior) are out of scope for a
  *card generator* — they belong to a sandbox runtime (e.g. a capability-based
  skill sandbox). The card declares and points; the runtime enforces. The
  honest output reflects this: a declared manifest scores `MEDIUM`, never
  `STRONG`, because declaration without enforcement is a claim, not a guarantee.

## The hard truth encoded in the grades

Cryptography certifies **origin and integrity** (layers 1–3). It never certifies
**behavior** (layers 6–7). That is why a signed card maxes out the authorship
layer but the capability/behavior layers must be earned separately through
enforcement and audit. No signature — and no blockchain — closes that gap.
