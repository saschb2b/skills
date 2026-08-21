---
type: Library Notes
title: "urql"
description: "urql stays a lightweight, exchange-based client: behavior is composed from middleware-like exchanges, with document caching by default and opt-in normalized caching via `@urql/exchange-graphcache`."
tags: [javascript, graphql]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# urql

**Verified 2026-08-20.** Check the installed `urql` / `@urql/core` versions first; re-verify if newer than below.

**Current stable**: urql 5.0 (React binding) on `@urql/core` 6.x. **LLM default bias**: urql 1.x to 3.x. `useQuery` tuple results, manual exchange wiring with hand-called `share()`, and older Graphcache.

## The shift
urql stays a lightweight, exchange-based client: behavior is composed from middleware-like exchanges, with document caching by default and opt-in normalized caching via `@urql/exchange-graphcache`. v5 simplified custom-exchange authoring (`composeExchanges` handles `share()` internally), added `TypedDocumentNode` inference, and exported previously-missing SSR types. One package per framework (React, Vue, Svelte, Solid).

## Stop / Start
| Stop (older urql) | Start (urql 5) |
| --- | --- |
| Manually calling `share()` inside custom exchanges | Let `composeExchanges` handle sharing |
| Assuming normalized caching is built in | Add `@urql/exchange-graphcache` explicitly (default is document caching) |
| Hand-writing operation result types | `TypedDocumentNode` (graphql-codegen client preset is the canonical pairing) |
| Old Graphcache with IndexedDB serialization | Graphcache 9.x |
| Duplicating `@urql/core` / `wonka` in the dep tree | Deduplicate both on upgrade |
| Assuming every operation is a POST | `@urql/core` 6 sends short queries as GET; set `preferGetMethod: false` if the server cannot serve them |

## Gotchas
- urql uses the `wonka` streaming library; version skew with `wonka` causes subtle bugs and bundle bloat.
- Framework bindings version independently of `@urql/core`; check each package, not just the `urql` meta-package. The React binding is still 5.x while the core is already 6.x, so the two numbers are expected to disagree.
- The one breaking change in core 6 is the GET default for queries under about 2048 characters (query string plus variables). Servers that only accept POST, or CDN setups that cache GET responses unexpectedly, need `preferGetMethod` and `preferGetForPersistedQueries` set to `false`.
- Maintenance moved to the community `urql-graphql` org; some docs still reference Formidable.

## Companion
GraphQL codegen notes in [../api-codegen/graphql-codegen.md](../api-codegen/graphql-codegen.md).

## Sources
- https://github.com/urql-graphql/urql
- https://github.com/urql-graphql/urql/blob/main/packages/core/CHANGELOG.md
