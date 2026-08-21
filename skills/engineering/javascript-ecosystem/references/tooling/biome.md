---
type: Library Notes
title: "Biome"
description: "Biome is the maintained successor to Rome, a single Rust binary that does both lint and format, aiming to replace ESLint plus Prettier."
tags: [javascript, tooling]
generated: { by: claude-code/unversioned, at: 2026-08-21T00:00:00Z }
---
# Biome

**Verified 2026-08-20.** Check the installed `@biomejs/biome` version first; re-verify if newer than below.

**Current stable**: 2.5 (Jun 2026). **LLM default bias**: "Rome" (the abandoned predecessor), or Biome 1.x positioned as only a formatter, and the assumption that it cannot do type-aware lint rules or custom plugins.

## The shift
Biome is the maintained successor to Rome, a single Rust binary that does both lint and format, aiming to replace ESLint plus Prettier. v2 introduced type-aware linting (without needing the TypeScript compiler) and a GritQL plugin system. By 2.5 the rule count passed 500, GritQL plugins can emit code fixes, and cross-file linting rides on the module graph.

## Stop / Start
| Stop (LLM default) | Start (current Biome) |
| --- | --- |
| "Rome" | Biome (Rome is dead; Biome is the fork that lived) |
| ESLint + Prettier as two tools | `biome check` (lint, format, import sorting in one binary) |
| "Biome cannot do type-aware rules" | Its type-aware lint rules (v2+, no `tsc` required) |
| "Biome has no plugin system" | GritQL plugins for custom diagnostics |
| `.prettierrc` plus ESLint config sprawl | A single `biome.json` |
| "Biome is JS/TS only" | Also CSS, GraphQL, and HTML (with a11y rules), plus Vue, Svelte, and Astro files |

## Gotchas
- Type-aware linting is broader than 1.x but still not full parity with `typescript-eslint`'s type-checked rules. Keep ESLint for niche type-rules if needed.
- The GritQL plugin and CST-querying APIs are still evolving across 2.x minors. Pin versions and test.

## Companion
[eslint.md](./eslint.md) is the incumbent linter Biome consolidates, and the one to stay on when a needed rule or plugin has no Biome equivalent.

## Sources
- https://biomejs.dev/blog/biome-v2-5/
- https://biomejs.dev/linter/plugins/
