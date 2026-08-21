---
type: Library Notes
title: "Sanity"
description: "The Studio is config-as-code in a single `sanity.config.ts` (no more `sanity.json`/parts)."
tags: [javascript, cms]
generated: { by: claude-code/unversioned, at: 2026-08-21T00:00:00Z }
---
# Sanity

**Verified 2026-08-20.** Check the installed `sanity` version first; re-verify if newer than below.

**Current stable**: Studio v6 (6.10); v5 shipped Dec 2025, v6 Jun 2026. **LLM default bias**: Studio v2 (the `sanity.json`/`parts` system, React 16/17) and pre-TypeGen GROQ with hand-written, untyped result types.

## The shift
The Studio is config-as-code in a single `sanity.config.ts` (no more `sanity.json`/parts). Content lives in the hosted Content Lake and is queried with GROQ. Sanity TypeGen is now GA: it reads your schema and `groq`-tagged queries to emit a `sanity.types.ts` for end-to-end typed queries. v5 rebased the Studio on React 19.2, and v6 raised the baseline to Node 22.12, moved the build to Vite 8, and turned React strict mode on by default in development.

## Stop / Start
| Stop (Studio v2) | Start (current Sanity) |
| --- | --- |
| `sanity.json` + the `parts` system | A code-first `sanity.config.ts` with `defineConfig` and `plugins` |
| Hand-writing TS interfaces for GROQ results | `sanity typegen generate` to emit `sanity.types.ts` |
| Plain-string GROQ queries | The `groq` tagged template with uniquely named queries |
| `defineConfig` assuming React 18 | React 19.2+ as the Studio peer |
| Node 20 for the CLI | Node 22.12+ (required since v6) |
| The `groqLegacy` search default | `groq2024` search (the v6 default) with wildcards, phrases, negation |
| Loose schema object literals | `defineType` / `defineField` / `defineArrayMember` |

## Gotchas
- Four majors landed since late 2022 (v3 Nov 2022, v4 Jul 2025, v5 Dec 2025, v6 Jun 2026); schemas, config shape, and content APIs are largely source-compatible across the jumps, so v5 to v6 is close to a one-line upgrade.
- v6 makes `auth.providers` replace the defaults rather than append, and drops the `mode` option; custom login screens need a re-check.
- Strict mode in dev surfaces existing effect-cleanup bugs in custom components; opt out with `reactStrictMode: false` in `sanity.cli` if it blocks the upgrade.
- v5 changed TypeGen output casing; regenerate and fix imports after upgrading.
- TypeGen only types queries that use the `groq` tag and have unique names; inline plain-string queries stay silently untyped.
- `next-sanity` is the recommended bridge for Next.js front ends.

## Companion
[payload.md](./payload.md) is the code-first TypeScript alternative that runs inside Next.js, and [strapi.md](./strapi.md) is the self-hosted Node option.

## Sources
- https://www.sanity.io/blog/sanity-studio-v6
- https://www.sanity.io/docs/changelog
- https://www.sanity.io/docs/apis-and-sdks/sanity-typegen
