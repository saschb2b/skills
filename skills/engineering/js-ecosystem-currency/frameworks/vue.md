# Vue

**Verified 2026-06-04.** Check the installed `vue` version first; re-verify if newer than below.

**Current stable**: 3.5 (3.6 with Vapor Mode in beta). **LLM default bias**: Vue 2 Options API, `Vue.component`, mixins, Vuex, plus Options-heavy early Vue 3.

## The shift
`<script setup>` Composition API is the idiomatic default. Shared logic moves from mixins to composables, state from Vuex to Pinia, two-way binding to `defineModel()`. Vue 3.6 adds Vapor Mode, an opt-in virtual-DOM-free compile path for Solid and Svelte-class performance, still experimental.

## Stop / Start
| Stop (LLM default) | Start (current Vue) |
| --- | --- |
| Options API (`data`/`methods`/`computed`) as default | `<script setup>` with `ref`/`reactive`/`computed` |
| Mixins for shared logic | Composables (`useX()` functions) |
| Runtime `defineProps`/`defineEmits` objects | Type-based `defineProps<T>()` / `defineEmits<T>()` |
| `modelValue` + `update:modelValue` boilerplate | `defineModel()` (stable since 3.4) |
| Vuex | Pinia, the official state default |
| `Vue.component` global registration | Explicit imports and `createApp().use()` |

## Gotchas
- Vapor Mode is opt-in per component and not production-ready in 3.6 beta. Do not assume it.
- The 3.6 reactivity rewrite is internal and mostly backward compatible. Retest performance-sensitive code.
- `defineModel()` replaces the old `modelValue` prop plus `update:modelValue` emit pattern.

## Sources
- https://vuejs.org/about/releases
- https://blog.vuejs.org/
- https://github.com/vuejs/core/releases
