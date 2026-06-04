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

### Meta-frameworks
| Tool | Headline shift | Notes |
| --- | --- | --- |
| Next.js | App Router + RSC default; explicit `"use cache"`; Turbopack | [nextjs.md](./meta-frameworks/nextjs.md) |
| Nuxt | `app/` srcDir default; Nitro 3 waits for Nuxt 5 | [nuxt.md](./meta-frameworks/nuxt.md) |
| React Router | Remix v2 merged in; framework mode is the successor | [react-router.md](./meta-frameworks/react-router.md) |
| SvelteKit | Runes; remote functions (experimental) | [sveltekit.md](./meta-frameworks/sveltekit.md) |
| Astro | Content Layer API, Server Islands, Actions | [astro.md](./meta-frameworks/astro.md) |
| TanStack Start | v1 RC full-stack on Router + Vite; `createServerFn` | [tanstack-start.md](./meta-frameworks/tanstack-start.md) |

### UI and styling
| Tool | Headline shift | Notes |
| --- | --- | --- |
| Material UI | v9 (no v2/v8); CSS-variables theming; Grid v2 `size` | [mui.md](./ui/mui.md) |
| Tailwind CSS | v4 CSS-first `@theme`; no config file; Oxide engine | [tailwind.md](./ui/tailwind.md) |
| shadcn/ui | `shadcn` CLI; React 19 + Tailwind v4; `data-slot`; OKLCH | [shadcn.md](./ui/shadcn.md) |
| Mantine | Emotion gone since v7; v9 is React 19.2+ | [mantine.md](./ui/mantine.md) |
| Chakra UI | v3 rewrite on Ark UI; namespaced compound API | [chakra.md](./ui/chakra.md) |
| UnoCSS | Atomic engine; `presetWind4` tracks Tailwind v4 | [unocss.md](./ui/unocss.md) |
| Motion | `framer-motion` is now `motion`; import `motion/react` | [motion.md](./ui/motion.md) |

### Data and state
| Tool | Headline shift | Notes |
| --- | --- | --- |
| TanStack Query | v5 single object arg; `useSuspenseQuery`; `gcTime` | [tanstack-query.md](./data/tanstack-query.md) |
| Redux Toolkit | Redux is RTK now; `createSlice`; RTK Query built-in | [redux-toolkit.md](./data/redux-toolkit.md) |
| Zustand | v5 `useShallow`; native `useSyncExternalStore` | [zustand.md](./data/zustand.md) |
| Jotai | v2 vanilla store; async atoms hold promises | [jotai.md](./data/jotai.md) |
| Pinia | Official Vue store (not Vuex); v3 setup stores | [pinia.md](./data/pinia.md) |

Picking one: a server-cache library (TanStack Query) for fetched data, a client-state library (Zustand or Jotai) for local global state, and Redux Toolkit for genuinely complex shared client state. Keep server data out of the client-state libraries.

### Tooling and language
| Tool | Headline shift | Notes |
| --- | --- | --- |
| TypeScript | ESM-first strict configs; Go-based `tsgo` in preview | [typescript.md](./tooling/typescript.md) |
| Vite | ESM-only; Rolldown unifies the bundler | [vite.md](./tooling/vite.md) |
| Node.js | Native TS type stripping; `node:test`; `--watch` | [node.md](./tooling/node.md) |
| ESLint | Flat config (`eslint.config.js`) is the only system | [eslint.md](./tooling/eslint.md) |
| Package managers | pnpm security-by-default; Bun full toolchain | [package-managers.md](./tooling/package-managers.md) |
| Biome | One Rust binary for lint + format; type-aware rules | [biome.md](./tooling/biome.md) |
| Storybook | v10 ESM-only; testing via the Vitest addon | [storybook.md](./tooling/storybook.md) |
| Turborepo | v2 `tasks` key (not `pipeline`); Rust; `turbo watch` | [turborepo.md](./tooling/turborepo.md) |
| Nx | v22 Project Crystal inferred targets; polyglot | [nx.md](./tooling/nx.md) |

### Testing
| Tool | Headline shift | Notes |
| --- | --- | --- |
| Vitest | The default Vite-project runner; stable Browser Mode | [vitest.md](./testing/vitest.md) |
| Playwright | The modern e2e default; role locators, auto-wait | [playwright.md](./testing/playwright.md) |
| Jest | v30, but legacy for new Vite/ESM projects | [jest.md](./testing/jest.md) |
| Testing Library | RTL 16; async `userEvent.setup()`; accessible queries | [testing-library.md](./testing/testing-library.md) |
| Cypress | v15, now runner-up to Playwright for new e2e | [cypress.md](./testing/cypress.md) |

New Vite + React + TS default: Vitest (unit and component) plus Testing Library plus Playwright (e2e). Jest and Cypress are the secondary choices, not the defaults.

### Backend
| Tool | Headline shift | Notes |
| --- | --- | --- |
| Express | v5 auto-forwards async rejections; new routing syntax | [express.md](./backend/express.md) |
| Hono | Web-standard, runtime-agnostic; zero-codegen RPC | [hono.md](./backend/hono.md) |
| Fastify | v5 needs Node 20+; deprecations removed | [fastify.md](./backend/fastify.md) |
| Nitro | Deploy-anywhere; Nitro 3 + h3 v2 rewrite (beta) | [nitro.md](./backend/nitro.md) |
| Drizzle ORM | 1.0 RC; RQB v2; validators as subpaths | [drizzle.md](./backend/drizzle.md) |
| Prisma ORM | v7 drops the Rust engine; driver adapters required | [prisma.md](./backend/prisma.md) |
| tRPC | v11 native TanStack Query options; RSC support | [trpc.md](./backend/trpc.md) |

### Forms and validation
| Tool | Headline shift | Notes |
| --- | --- | --- |
| Zod | v4 rewrite; top-level `z.email()`; unified `error` param | [zod.md](./forms/zod.md) |
| React Hook Form | v7 spread `register`; validate via a resolver | [react-hook-form.md](./forms/react-hook-form.md) |
| TanStack Form | v1 stable, headless; Standard Schema (no resolver) | [tanstack-form.md](./forms/tanstack-form.md) |

New-project default: React Hook Form + Zod 4 via `@hookform/resolvers`, or TanStack Form + Zod 4 (direct via Standard Schema) for the type-safety-first, multi-framework path. Formik is unmaintained.

### Auth
| Tool | Headline shift | Notes |
| --- | --- | --- |
| Auth.js | NextAuth renamed; v5 beta and maintenance-only | [auth-js.md](./auth/auth-js.md) |
| Better Auth | TS-native, DB-owned; the rising default for new apps | [better-auth.md](./auth/better-auth.md) |
| Clerk | Managed; `clerkMiddleware()` and async `auth()` | [clerk.md](./auth/clerk.md) |

Self-hosted new-project default is Better Auth (the Auth.js team steers new work there); Clerk for managed. Lucia is sunset; do not recommend it.

### Internationalization
| Tool | Headline shift | Notes |
| --- | --- | --- |
| i18next | TypeScript-first; module augmentation; Selector API | [i18next.md](./i18n/i18next.md) |
| next-intl | App Router native; `AppConfig` typing; `setRequestLocale` | [next-intl.md](./i18n/next-intl.md) |
| Paraglide JS | Compiler-based typed message functions; tree-shakable | [paraglide.md](./i18n/paraglide.md) |

Two architectures: runtime dictionaries (i18next, next-intl) with types layered on, versus compiled message functions (Paraglide) that tree-shake.

### Dates and time
| Tool | Headline shift | Notes |
| --- | --- | --- |
| Temporal | Stage 4 / ES2026; immutable types replace `Date` | [temporal.md](./dates/temporal.md) |
| date-fns | v4 first-class time zones via `@date-fns/tz` | [date-fns.md](./dates/date-fns.md) |
| Day.js | ~2 KB immutable Moment drop-in; plugin-gated | [dayjs.md](./dates/dayjs.md) |

Prefer native Temporal where supported (or via polyfill); date-fns or Day.js as the lightweight interim. Moment.js is legacy; do not start new projects on it.

### API codegen
| Tool | Headline shift | Notes |
| --- | --- | --- |
| Hey API | REST SDK + TanStack options factories, not hooks | [hey-api.md](./api-codegen/hey-api.md) |
| GraphQL Codegen | Client preset + `graphql()` document; fragment masking | [graphql-codegen.md](./api-codegen/graphql-codegen.md) |
| Orval | Hooks-first but options-capable (`useQuery: false`) | [orval.md](./api-codegen/orval.md) |
| openapi-fetch | Types-only + `createClient`; `$api.useQuery(...)` | [openapi-fetch.md](./api-codegen/openapi-fetch.md) |

Modern codegens stopped emitting framework-specific named hooks (`useGetPetQuery`). They emit framework-agnostic options factories (REST) and typed documents (GraphQL) that you spread or pass into the data library's own hook (`useQuery({ ...getPetOptions(...) })`, `useQuery(MyDocument)`). For full setup, use the dedicated **codegen-api** skill.

## When a tool is not in the index

The catalogue is not exhaustive, and it dates. For any tool not listed, or when a notes file looks stale, apply the same method by hand:

1. Read the installed version from `package.json` and the lockfile.
2. Open the tool's official release notes, changelog, or migration guide for that major.
3. Identify the paradigm the current major moved to, and the pattern it replaced.
4. Write the Start pattern. Flag the Stop pattern if the code or your default reaches for it.
5. If the tool deserves a permanent entry, add one with [_template.md](./_template.md).

## Companion skills

Three sibling skills in this repo go deeper than the notes here. Prefer them when in scope.

- **react-compiler**. The manual-memoization audit and the silent compiler-bail patterns.
- **codegen-api**. Typesafe API codegen (options factories over hooks, fragment masking).
- **theme-colors**. Color roles for Material UI and other themed systems.

## Extending this skill

Add a tool by copying [_template.md](./_template.md) into the right category folder and adding one row to the matching table above. Keep volatile version numbers inside the notes file, never in this index, so there is a single place to re-verify. Re-verify a notes file whenever you work on its tool and the snapshot date looks old.

## Source

Based on [The LLM Default React Stack](https://www.saschb2b.com/blog/llm-default-react-stack).
