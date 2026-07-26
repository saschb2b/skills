---
type: Render Spec
title: "Visual card and render feed"
description: "How a trust card draws as a Magic-style SVG cartridge, the data the skill exposes for rendering, and this repo's reference renderer and feed."
tags: [trust, provenance, rendering, svg]
generated: { by: claude-code/unversioned, at: 2026-06-29T00:00:00Z }
---

# Visual card and render feed

A trust card can be drawn as a shareable image without changing what it
attests. The skill exposes the data; a renderer turns it into a picture.

## What the skill exposes for rendering

- `card.py verify --json` prints the graded gradient and card facts as JSON
  (title, risk_tier, target_digest, identity, expires, capability, the six
  `layers`, their `grades`, and `notes`). A renderer reads this, so the picture
  never re-implements the grading.
- The `CARD.md` body also carries an embedded `<!--card-data ...-->` JSON block
  for the same purpose when JSON output is not convenient.
- `CARD.svg` (the rendered label) and any `hero.*` art are decoration, excluded
  from the integrity digest (alongside `CARD.md`, `*.manifest.json`, `*.key`,
  `*.pem`). Adding or restyling the visual never changes the bytes the card
  attests, so integrity stays STRONG.

## The reference renderer (this repo)

`scripts/build-cards.mjs`, run as `pnpm cards`, is this repo's reference
implementation. It is repo glue, not part of the installed skill payload. It
writes a `CARD.svg` per skill from the `verify --json` data, and an aggregated
`cards.json` feed (every skill's facts, grades, domain, trust score, and rarity)
for rendering a gallery elsewhere. `pnpm cards:check` is wired into CI; it
rebuilds and fails if a card is stale against its live bundle, and a `git diff`
on `cards.json` and the SVGs catches a feed left unbuilt. Everything is
deterministic, so the files commit cleanly.

## The cartridge layout

The label borrows the Magic the Gathering card frame, top to bottom. A black
rounded border, a color-identity frame, a title bar with the skill name and a
cost pip, an art window, a type line with a rarity symbol, a parchment text box
holding the trust bars and the description as flavor text, and a bottom line
with the signing identity, a short digest, and a power/toughness-style score
box. The ratio is 5 by 7 (360 by 504), matching a real card.

## The mappings

| Card element | Driven by |
| --- | --- |
| Frame color (color identity) | Domain. Frontend blue, Game red, AI artifact-silver, Writing white-gold, Mobile green, Security black |
| Cost pip | Risk tier (for example `L1`) |
| Rarity symbol | Verification ceremony (generated, declared, signed, attested) |
| Score box | Verification completeness, score over reachable max |
| Art window | Digest-seeded identicon, or the skill's `hero.*` art |
| Trust bars (six) | Each layer's grade, drawn as a fill level |
| Flavor text | The card description |

Trust score. Each applicable layer scores STRONG 3, MEDIUM 2, WEAK 1, otherwise
0, and the card shows the sum over the *reachable* maximum, not a flat 18. Layers
that do not apply are dropped (content provenance is n/a for executable skills),
and per-layer ceilings are respected (capability tops out at MEDIUM for a skill,
freshness never grades STRONG), so a skill's reachable max is 13 and a knowledge
bundle's is 16. The score is verification completeness, not skill quality.

Rarity tracks that ceremony rather than a grade. `common` is generated only,
`uncommon` adds a declared capability, `rare` adds a signature, and `mythic`
adds independent attestations. Signing and attestation are release-time steps,
so a freshly built, integrity-verified skill resting at `uncommon` (7 of 13) is
expected, not a defect.

## Hero art slot

Drop a `hero.png`, `hero.jpg`, `hero.svg`, `hero.webp`, or `hero.gif` into a
skill directory and rerun `pnpm cards`. It is embedded as a base64 data URI so
the SVG stays self-contained, fills the art window, and replaces the identicon.
Like `CARD.svg` it is excluded from the integrity digest, so adding art carries
no trust consequence.
