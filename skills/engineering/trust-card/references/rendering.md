---
type: Render Spec
title: "Visual card and render feed"
description: "How a trust card draws as a generated book cover seeded by its digest, the data the skill exposes for rendering, and this repo's reference renderer and feed."
tags: [trust, provenance, rendering, svg]
generated: { by: openai-codex/gpt-5, at: 2026-08-06T23:02:18Z }
---

# Visual card and render feed

## Contents

- [Rendering data](#what-the-skill-exposes-for-rendering)
- [Reference renderer](#the-reference-renderer-this-repo)
- [Cover design](#the-cover-design)
- [Mappings and scoring](#the-mappings)
- [Hero art](#hero-art-slot)

A trust card can be drawn as a shareable image without changing what it
attests. The skill exposes the data; a renderer turns it into a picture.

## What the skill exposes for rendering

- `card.py verify --json` prints the graded gradient and card facts as JSON
  (title, risk_tier, target_digest, identity, expires, capability, the six
  `layers`, their `grades`, and `notes`). A renderer reads this, so the picture
  never re-implements the grading.
- The `CARD.md` body also carries an embedded `<!--card-data ...-->` JSON block
  for the same purpose when JSON output is not convenient.
- `CARD.svg` (the rendered cover) and any `hero.*` art are decoration, excluded
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

## The cover design

Without hero art, each card draws as an abstract generated book cover at a 672
by 936 canvas. The bundle's sha256 digest seeds a deterministic PRNG, and every
generative visual decision falls out of the digest bytes. Change the content
and the skill gets a new edition with new art; the same renderer, digest, and
verification feed always reproduce the same complete cover.

The digest picks, independently:

- A palette from one global pool of curated print palettes (paper ground, ink,
  three accents), so a shelf of covers varies like a publisher's list.
- One of six flat print-style compositions: sun arcs, organic blob, op-art
  waves, bauhaus grid, torn-paper collage, diagonal beams. Overlaps multiply
  like ink on paper on light grounds and stack opaquely on dark ones.
- One of four layouts: art above the title block, title banner above the art,
  a full-page poster with the title on a floating panel, or a typographic
  cover where the title itself is the art with sparse accents.
- A typographic voice (serif, sans, mono) and a centered or left alignment
  for the title block.
- A film-grain seed, giving the whole cover a risograph texture.

The bottom of every cover is a fixed colophon, identical across layouts, so the
trust information always reads the same way. Domain also stays constant as the
series line above the title.

## The mappings

| Cover element | Driven by |
| --- | --- |
| Series line | Domain (Frontend / UI, Game, AI & Agents, ...) |
| Art, palette, layout, type voice | Digest bytes through the seeded PRNG, or the skill's `hero.*` art |
| Title and tagline | Skill name and card description |
| Author line | Signing identity |
| Colophon meters (six) | Each layer's grade, drawn as a 0 to 3 fill level |
| Colophon score line | Rarity label, score over reachable max, risk tier |
| Colophon capability line | Capability model and manifest source |
| Colophon barcode | The digest bytes, drawn as ISBN-style bars, with the short digest and expiry beneath |

Trust score. Each applicable layer scores STRONG 3, MEDIUM 2, WEAK 1, otherwise
0, and the card shows the sum over the *reachable* maximum, not a flat 18. Layers
that do not apply are dropped (content provenance is n/a for executable skills),
and per-layer ceilings are respected (capability tops out at MEDIUM for a skill,
freshness never grades STRONG), so a skill's reachable max is 13 and a knowledge
bundle's is 16. The score is verification completeness, not skill quality. The
grades themselves come from the layer checks defined in [Card layers](layers.md).

Rarity tracks the verification ceremony rather than a grade. `common` is
generated only, `uncommon` adds a declared capability, `rare` adds a signature,
and `mythic` adds independent attestations. Signing and attestation are
release-time steps, so a freshly built, integrity-verified skill resting at
`uncommon` (7 of 13) is expected, not a defect.

The cover reports this evidence but does not set the acceptance bar. See
[Grading and consumer policy](grading.md) for policy syntax and example bars.

## Hero art slot

Drop a `hero.png`, `hero.jpg`, `hero.svg`, `hero.webp`, or `hero.gif` into a
skill directory and rerun `pnpm cards`. It is embedded as a base64 data URI so
the SVG stays self-contained and replaces the generated composition in the art
region (the typographic layout falls back to the art-above-title layout so the
hero has somewhere to live). Like `CARD.svg` it is excluded from the integrity
digest, so adding art carries no trust consequence.
