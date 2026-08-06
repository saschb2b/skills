---
name: trust-card
description: >-
  Generate, sign, attest, and verify holistic trust cards for OKF knowledge
  bundles and agent skills. A card binds content, artifact, and capability
  provenance into one OKF concept and renders a graded trust gradient instead of
  a binary "verified" badge, and can be drawn as a shareable SVG book cover. Use
  this skill whenever the user wants to make a
  skill card, trust card, or provenance card; render or visualize a card; sign or attest a bundle or skill;
  prove a bundle is unaltered; declare or check a permission/capability manifest;
  or decide whether a skill or knowledge bundle is safe to load, even if they
  only say "card", "sign it", "is this skill trustworthy", or "verify this
  bundle".
license: MIT
---

# Trust Card

Builds a **holistic trust card** for an OKF bundle or an agent skill. The card
is itself an OKF concept (`type: Card`), so it lives in the bundle, version-
controls cleanly, and renders in any OKF viewer.

## The one idea that makes this work

A card is **graded evidence, not a verdict**. It never stamps "verified". It
attaches every layer of proof the producer can supply, and the *consumer*
computes a trust gradient against its own policy. This is OKF's own asymmetry
applied to trust: **producers are precise, consumers are forgiving** — a layer
that can't be verified is reported `UNVERIFIED`, never a hard failure.

This matters because of two hard limits you cannot engineer around:

- A signature (or a transparency log, or a chain) proves **origin and
  integrity**. It can never prove **behavior**. A perfectly signed credential-
  stealer is a perfectly valid signature on malware.
- "Reflects what it does" is closed by sandboxing, audit, and declared-vs-
  observed checks — not by cryptography. So the card grades those separately and
  refuses to collapse them into one badge.

## The three provenances a card binds

1. **content provenance** — where each claim came from (OKF `# Citations`,
   `references/` with fetch dates). Unique to knowledge bundles; executable
   skills have none because code has no sources.
2. **artifact provenance** — who shipped this exact byte sequence, unaltered
   (digest + signature + transparency log).
3. **capability provenance** — what it will *do*. For a skill that's a
   permission manifest (files/network/shell). For a knowledge bundle it's
   **epistemic**: what it injects into context and what domain it asserts
   authority over. A poisoned legal concept opens no socket; it silently
   corrupts every downstream answer. That is the knowledge-bundle threat model,
   and the card scores it as `epistemic-L0..L2`.

The full layer-by-layer breakdown — what each proves, its trust anchor, and
whether it's solved or still open — is in `references/layers.md`. Read it before
explaining a card's output to a user.

## Commands

The script is `scripts/card.py` (stdlib only; `cryptography` is used for local
ed25519 signing if present, and `cosign` is used for keyless Sigstore+Rekor if
on PATH).

```bash
# 1. Generate a card from a bundle or skill directory.
python scripts/card.py generate <dir> \
    --identity did:web:example.com --expires 2027-01-01
#    -> writes <dir>/CARD.md and <dir>/CARD.manifest.json
#    -> auto-detects okf vs skill; warns if skill capability is INFERRED

# 2. Sign the bound digest. Keeps the key OUTSIDE the bundle.
python scripts/card.py sign <dir>/CARD.md --key ~/keys/card.key
#    uses cosign keyless (Sigstore+Rekor) if available, else local ed25519

# 3. Attach an independent attestation (the vouching chain).
python scripts/card.py attest <dir>/CARD.md \
    --kind scan   --by did:web:scanner.example  --result pass
python scripts/card.py attest <dir>/CARD.md \
    --kind review --by did:web:auditor.example  --result vouch

# 4. Verify: recompute integrity from the live bundle, render the gradient,
#    optionally enforce a consumer policy (--json for a machine-readable gradient).
python scripts/card.py verify <dir>/CARD.md --bundle <dir> \
    --policy integrity:STRONG,authorship:MEDIUM,capability:MEDIUM

# 5. Conformance check (OKF's one hard rule + soft warnings).
python scripts/card.py validate <dir>/CARD.md
```

## Workflow guidance

- **Default to `generate` then `verify --bundle`** so the user sees the gradient
  immediately. Always run verify against the *live* directory — that's what
  catches tampering (the digest is recomputed, not trusted).
- **Never write signing keys into the bundle.** Pass `--key` to a path outside
  the directory. The script enforces this by excluding `*.key`/`*.pem` from the
  digest, but the key still shouldn't be committed.
- **Signing is optional and honest.** With no signing tool and no key, the card
  is generated and marked unsigned rather than failing. Say so plainly.
- **Read the output as a gradient.** Don't report "valid/invalid". Report each
  layer's grade and what it means. The point is to let the user set their own
  bar via `--policy`. Policy syntax and example bars are in
  `references/grading.md`.
- **For knowledge bundles, foreground the epistemic risk.** `epistemic-L2` means
  it asserts over a regulated domain (legal/medical/financial), so silent
  corruption is high-impact even though it executes nothing.
- **For skills with inferred capability**, state clearly that shell/network were
  *guessed from the code*, not declared or enforced, and recommend a declared
  permission manifest plus a sandbox runtime as the real fix.

## Visual card and render feed

A card can be drawn as a shareable SVG book cover. Its digest seeds a palette,
one of six abstract print compositions, one of four layouts, and a typographic
voice. The skill's domain becomes the series line; the title and description
become cover copy; and a fixed colophon shows the six trust meters, rarity,
score, risk tier, capability model, digest barcode, and expiry. `CARD.svg` and
any `hero.*` art are **decoration excluded from the integrity digest**, so
styling a card never changes what it attests.

- `card.py verify --json` emits the graded gradient as JSON, the input a
  renderer reads (so the picture never re-implements grading).
- This repo's reference renderer is `scripts/build-cards.mjs` (`pnpm cards`),
  which writes a `CARD.svg` per skill plus an aggregated `cards.json` feed;
  `pnpm cards:check` is wired into CI to fail on a stale card.
- Drop a `hero.png` or `hero.svg` into a skill to replace the digest identicon
  with real art.

The full layout, the domain-to-color and trust-to-rarity mappings, the score
formula, and the feed shape are in `references/rendering.md`.

## What to tell the user about limits

Be straight: this card gives verifiable **origin, integrity, declared
capability, and content lineage**, plus hooks for independent audit. It does
**not** prove the artifact is safe or does only what it claims — that needs
runtime sandboxing and human/automated audit, which the `capability` and
`vouching` layers point at but cannot replace.
