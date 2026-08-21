---
type: Library Notes
title: "Astro"
description: "Astro 5 replaced legacy content collections with the Content Layer API (pluggable loaders for any source), merged `static` and `hybrid` into a single `static` default that goes dynamic per-route..."
tags: [javascript, meta-frameworks]
generated: { by: claude-code/unversioned, at: 2026-08-21T00:00:00Z }
---
# Astro

**Verified 2026-08-20.** Check the installed `astro` version first; re-verify if newer than below.

**Current stable**: 7.1 (Jul 2026); 7.0 shipped Jun 2026, 6.0 Mar 2026. **LLM default bias**: Astro 3 and 4. Legacy glob content collections, `output: 'hybrid'`, and no server islands or actions.

## The shift
Astro 5 replaced legacy content collections with the Content Layer API (pluggable loaders for any source), merged `static` and `hybrid` into a single `static` default that goes dynamic per-route when an adapter is added, and introduced Server Islands and Astro Actions. Astro 6 removes the legacy content API entirely and rebuilds the dev server on Vite's Environment API. Astro 7 makes the Rust compiler and the Rust Markdown pipeline (Sätteri) the defaults and adds route caching plus `src/fetch.ts` advanced routing.

## Stop / Start
| Stop (LLM default) | Start (current Astro) |
| --- | --- |
| Legacy `defineCollection` without a loader | Content Layer API with an explicit `loader:` (`glob()`, `file()`, custom) |
| `output: 'hybrid'` | `output: 'static'` (default) plus an adapter; mark routes with `export const prerender = false` |
| Server-rendering a whole page for one dynamic widget | Server Islands (`server:defer`) |
| Custom API endpoints for form and mutation calls | Astro Actions (`astro:actions`) with validation |
| `import.meta.env` for typed or secret env | `astro:env` (typed, client/server-segmented schema) |

## Gotchas
- Astro 6 fully removes legacy content collections. Any unmigrated collection breaks the build.
- Astro 6 upgrades to Vite 7 and a new Zod major, and drops Node 18 and 20. Target Node 22+.
- Astro 7's Rust compiler is stricter (unclosed tags and unterminated attributes are now errors) and collapses whitespace between elements JSX-style, so visible spacing can change.

## Agent skills
Astro ships an official Docs MCP server (`withastro/docs-mcp`, remote endpoint mcp.docs.astro.build/mcp), which replaced its `llms.txt`. Prefer the MCP for agent context.

## Companion
[nextjs.md](./nextjs.md) is the React-first alternative when the site is app-shaped rather than content-shaped, and [sveltekit.md](./sveltekit.md) is the comparable choice in the Svelte ecosystem.

## Sources
- https://astro.build/blog/astro-7/
- https://astro.build/blog/astro-6/
- https://github.com/withastro/astro/releases
