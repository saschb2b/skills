---
type: Library Notes
title: "Pinia"
description: "Pinia is the official, default Vue store; Vuex is maintenance-only and should not be reached for in new code."
tags: [javascript, data]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# Pinia

**Verified 2026-08-20.** Check the installed `pinia` version first; re-verify if newer than below.

**Current stable**: 4.0 (Jul 2026). **LLM default bias**: Pinia v2, and more damagingly Vuex 3/4 with `state`/`getters`/`mutations`/`actions` modules and `mapState`/`mapActions`.

## The shift
Pinia is the official, default Vue store; Vuex is maintenance-only and should not be reached for in new code. v3 dropped Vue 2 (Vue 3 only) and the `defineStore({ id })` object syntax. v4 (Jul 2026) is another deliberately small major, breaking only on packaging: ESM only, Devtools API v8 as a separate install, and diagnostics-style errors. Store authoring is unchanged across both, so v2 to v4 usually needs zero code changes.

## Stop / Start
| Stop (LLM default) | Start (current Pinia) |
| --- | --- |
| Reaching for Vuex (modules, mutations, `mapState`) | Pinia as the default store |
| `defineStore({ id: 'counter', ... })` object syntax | `defineStore('counter', ...)` (object-id form removed in v3) |
| Options stores by default | Setup stores (`defineStore('x', () => { const c = ref(0); ...; return { c } })`) |
| Mutations as a separate concept | Mutate state directly inside actions (Pinia has no mutations) |
| Installing Pinia v3 or v4 on Vue 2 / Nuxt 2 | Stay on Pinia v2 there; v3+ is Vue 3 / Nuxt 3+ only |
| Assuming `pinia` still bundles the devtools API | v4 needs `@vue/devtools-api` installed alongside it |

## Gotchas
- v4 peer requirements are Vue 3.5.11+, TypeScript 5.6+, and `@vue/devtools-api` 8.x. It is ESM only, so CommonJS `require('pinia')` no longer resolves.
- In setup stores you must return everything you want exposed, and use `storeToRefs()` to destructure state and getters without losing reactivity.
- The v2 to v3 break is mostly the removed `defineStore({ id })` syntax and the `PiniaStorePlugin` to `PiniaPlugin` rename.

## Companion
Vue paradigm notes in [../frameworks/vue.md](../frameworks/vue.md).

## Sources
- https://pinia.vuejs.org/cookbook/migration-v2-v3.html
- https://github.com/vuejs/pinia/releases/tag/v4.0.0
- https://pinia.vuejs.org/core-concepts/
