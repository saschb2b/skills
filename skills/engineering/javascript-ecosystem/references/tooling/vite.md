---
type: Library Notes
title: "Vite"
description: "Vite is ESM-only since v7."
tags: [javascript, tooling]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# Vite

**Verified 2026-08-20.** Check the installed `vite` version first; re-verify if newer than below.

**Current stable**: v8 (8.2, Aug 2026); v8.0 shipped Mar 2026 and 8.1 in Jun 2026. **LLM default bias**: Vite 4 and 5. The esbuild (dev) plus Rollup (build) dual-bundler model, CommonJS-compatible configs, and Node 16/18 baselines.

## The shift
Vite is ESM-only since v7. v8 ships Rolldown, a Rust bundler, as the one unified bundler replacing both esbuild's transform role and Rollup, for builds up to 10x to 30x faster with broad plugin compatibility. The Environment API (introduced in v6) keeps maturing but is still not marked stable.

## Stop / Start
| Stop (LLM default) | Start (current Vite) |
| --- | --- |
| Scaffolding Vite 4 or 5 | `npm create vite@latest` |
| "esbuild for dev, Rollup for build" mental model | Rolldown as the one bundler (v8) |
| CommonJS `vite.config.js` with `require` | ESM config (`export default defineConfig(...)`) |
| Targeting Node 16 or 18 | Node 20.19+ / 22.12+ |
| Treating the Environment API as stable | Use it knowing it is still experimental |

## Gotchas
- Most existing plugins work on v8 through a compatibility layer that auto-converts `esbuild` and `rollupOptions` config to the Rolldown and Oxc equivalents. Verify custom options rather than assuming a rename.
- v8 install size grows roughly 15 MB (lightningcss is now a required dependency), and `@vitejs/plugin-react` v6 dropped Babel.
- ESM-only means there is no CommonJS entry; tooling that `require()`'d Vite must switch to dynamic `import()`.

## Sources
- https://vite.dev/blog/announcing-vite8
- https://vite.dev/guide/migration
