---
type: Grading Policy
title: "Grading and consumer policy"
description: "The STRONG to ABSENT gradient, the consumer policy syntax, and how to choose a verification bar by risk tier."
tags: [trust, provenance, security, policy]
generated: { by: claude-code/unversioned, at: 2026-06-29T00:00:00Z }
---

# Grading and consumer policy

## The gradient

Every layer is scored on one scale, strongest to weakest:

```
STRONG  > MEDIUM  > WEAK  > UNVERIFIED / ABSENT
```

- **STRONG** — verifiable and strongly bound (digest matches; Sigstore keyless +
  Rekor; knowledge bundle that provably executes nothing; ≥2 independent vouches).
- **MEDIUM** — verifiable but with a self-asserted or unenforced element (local
  ed25519 with self-asserted identity; a *declared* permission manifest;
  citations present; not expired).
- **WEAK** — present but weak (capability inferred from code, not declared; a
  single vouch).
- **UNVERIFIED / ABSENT** — not checkable here, missing, expired, or failed
  (no `--bundle` supplied; unsigned; integrity mismatch; no expiry).

The card never reduces these to one boolean. The consumer does, via policy.

## Policy syntax

A policy is a comma-separated list of `layer:min-grade` requirements passed to
`verify --policy`. The card is **accepted** only if every named layer meets or
exceeds its minimum; otherwise it's **rejected** with the specific shortfalls.

```bash
# strict: production CI loading an executable skill
--policy integrity:STRONG,authorship:STRONG,capability:MEDIUM,vouching:STRONG

# moderate: loading a knowledge bundle into an assistant
--policy integrity:STRONG,authorship:MEDIUM,capability:MEDIUM,content_provenance:MEDIUM

# minimal: a hobbyist sanity check
--policy integrity:STRONG,authorship:MEDIUM
```

Layer names usable in a policy: `integrity`, `authorship`, `capability`,
`content_provenance`, `vouching`, `freshness`.

## Choosing a bar by risk tier

- `epistemic-L2` (asserts over legal/medical/financial): require
  `content_provenance:MEDIUM` and `vouching:STRONG` — silent corruption is the
  threat, so demand citations and independent review.
- `executable-L2-unverified` (inferred shell/network, no manifest): do not load
  on `capability:WEAK`. Require a declared manifest (`capability:MEDIUM`) and
  enforce it in a sandbox.
- `epistemic-L0/L1`: `integrity:STRONG,authorship:MEDIUM` is usually enough.

## Why "accepted" is not "safe"

A policy pass means *the evidence you required is present and verifiable*. It is
not a safety proof. Behavior (does it do only what it claims) lives in layers 6–7
— enforcement and observation — which a card points at but cannot deliver. Keep
that distinction explicit when reporting a pass to a user.
