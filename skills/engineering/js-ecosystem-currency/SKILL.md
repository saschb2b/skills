---
name: js-ecosystem-currency
description: Default to the latest stable major versions of JavaScript and TypeScript frameworks and their current paradigms, instead of the older versions and patterns that dominate LLM training data. A version-and-paradigm changelog index that routes to per-tool notes. Use when writing, reviewing, scaffolding, or upgrading any JS or TS project, when choosing dependency versions, when an agent emits an outdated pattern, or when working with React, Angular, Vue, Svelte, Solid, Next.js, Nuxt, React Router, Remix, SvelteKit, Astro, TanStack Start, Material UI, Tailwind, shadcn, Mantine, Chakra, TanStack Query, Redux, Zustand, Jotai, TypeScript, Vite, Node, ESLint, pnpm, Bun, or Biome. Check the project's installed version first; this snapshot ages.
date: 2026-06-04
source_post: llm-default-react-stack
---

# JavaScript Ecosystem Currency

LLMs default to the framework versions and patterns their training data over-represents, which skew years behind the current stable releases. This skill is a changelog index that pulls default output forward to the latest stable major and its paradigm.

> "Every AI coding tool in 2026 produces the same React app. The brand on the box is different. The code inside is not."
>
> from [The LLM Default React Stack](https://www.saschb2b.com/blog/llm-default-react-stack)

## Rule

**Write for the version the project actually has, targeting the current paradigm, not the version your training data over-represents.** Version numbers move fast; the paradigm shifts move slowly. When unsure, trust the paradigm direction and verify the exact version against the source.

## How to use this skill

1. **Check the installed version first.** Read `package.json` and the lockfile. The installed major decides which paradigm applies. Never assume it from memory.
2. **Find the tool in the index** below and open its notes file for the Stop/Start table.
3. **Write and review against the Start column.** Rewrite the Stop-column patterns; those are the stale defaults an agent reaches for unprompted.
4. **Greenfield.** Scaffold on the latest stable major and its paradigm, not the version your training data over-represents.
5. **This snapshot is dated.** Each notes file carries a verified date and a current-stable version. If the installed version is newer, or the file looks stale, confirm against the official release notes linked in the file before trusting it. The paradigm sections age far slower than the version numbers.

## Index

Each notes file holds the current stable version, the LLM default bias, the paradigm shift, and a Stop/Start table.

### Frameworks
| Tool | Headline shift | Notes |
| --- | --- | --- |
| React | Compiler auto-memoizes; Actions, `use()`, RSC default | [react.md](./frameworks/react.md) |
| Angular | Signals, zoneless, standalone, `@if`/`@for` | [angular.md](./frameworks/angular.md) |
| Vue | `<script setup>` Composition API, Pinia, Vapor coming | [vue.md](./frameworks/vue.md) |
| Svelte | Runes (`$state`/`$derived`/`$effect`), snippets | [svelte.md](./frameworks/svelte.md) |
| Solid | 1.x stable; 2.0 makes async first-class | [solid.md](./frameworks/solid.md) |

## Companion skills

Three sibling skills in this repo go deeper than the notes here. Prefer them when in scope.

- **react-compiler**. The manual-memoization audit and the silent compiler-bail patterns.
- **codegen-api**. Typesafe API codegen (options factories over hooks, fragment masking).
- **theme-colors**. Color roles for Material UI and other themed systems.

## Extending this skill

Add a tool by copying [_template.md](./_template.md) into the right category folder and adding one row to the matching table above. Keep volatile version numbers inside the notes file, never in this index, so there is a single place to re-verify. Re-verify a notes file whenever you work on its tool and the snapshot date looks old.

## Source

Based on [The LLM Default React Stack](https://www.saschb2b.com/blog/llm-default-react-stack).
