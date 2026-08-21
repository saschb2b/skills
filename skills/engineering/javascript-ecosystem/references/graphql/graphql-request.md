---
type: Library Notes
title: "graphql-request"
description: "graphql-request remains the minimal, fetch-based, dependency-light client for scripts and simple apps (no cache, no React integration)."
tags: [javascript, graphql]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# graphql-request

**Verified 2026-08-20.** Check the installed `graphql-request` version first; re-verify if newer than below.

**Current stable**: 7.4 (December 2025, unchanged since). **LLM default bias**: graphql-request 3.x to 5.x. The functional `request(endpoint, query, variables)` style, CommonJS, and no first-class typed documents.

## The shift
graphql-request remains the minimal, fetch-based, dependency-light client for scripts and simple apps (no cache, no React integration). v7 is ESM-first (CJS still supported) and adds full `TypedDocumentNode` support so `client.request(typedDoc, variables)` infers result and variable types, plus `TypedDocumentString` for codegen's string mode.

## Stop / Start
| Stop (LLM default) | Start (graphql-request 7) |
| --- | --- |
| `request(endpoint, query, vars)` functional calls | `new GraphQLClient(endpoint, opts)` and `client.request(...)` |
| Passing plain `gql` documents and casting results | `TypedDocumentNode<T, V>` from graphql-codegen for inference |
| Assuming GraphQL errors are lost on HTTP 4xx/5xx | Read `error.response.errors` (v7 parses the body) |
| Reaching for it when you need caching, dedup, or hooks | urql or Apollo for stateful UIs; keep this for scripts, SSR, serverless |

## Gotchas
- The upstream repo was renamed and rewritten as Graffle (the old code is on the `graphql-request` branch); the npm package name is unchanged, which confuses source lookups.
- It is fetch-based with no built-in cache or request dedup. Do not treat it as an Apollo or urql replacement for stateful UIs.
- For a typed document-builder client, evaluate Graffle; graphql-request itself is in stable-maintenance. Graffle is the intended v8 and is still pre-release (`npm i graffle@next`, an `8.0.0-next.*` tag), so the stable install remains `graphql-request`.

## Companion
When a UI outgrows it and needs caching or dedup, move to [urql.md](./urql.md) or [apollo-client.md](./apollo-client.md). Typed documents come from [../api-codegen/graphql-codegen.md](../api-codegen/graphql-codegen.md).

## Sources
- https://www.npmjs.com/package/graphql-request
- https://github.com/graffle-js/graffle
