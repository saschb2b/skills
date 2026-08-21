---
type: Library Notes
title: "TypeScript"
description: "Modern configs are ESM-first and strict, with verbatim module syntax."
tags: [javascript, tooling]
generated: { by: claude-code/unversioned, at: 2026-08-21T00:00:00Z }
---
# TypeScript

**Verified 2026-08-20.** Check the installed `typescript` version and `tsconfig.json` first; re-verify if newer than below.

**Current stable**: 7.0 (Jul 2026), the Go-based native compiler, now stable. 6.0 (Mar 2026) was the last release on the original JavaScript codebase. **LLM default bias**: TS 5.0 to 5.5, `moduleResolution: "node"`, `esModuleInterop`-era CommonJS configs, and the assumption that `tsc` is always the slow JS-based compiler or that the Go compiler is still a preview.

## The shift
Modern configs are ESM-first and strict, with verbatim module syntax. TypeScript 7.0 (stable since Jul 2026) rewrites the compiler in Go for roughly 10x faster type-checking with the same type semantics. 6.0 is the transitional last release on the old codebase and turns long-deprecated options into errors.

## Stop / Start
| Stop (LLM default) | Start (modern TS) |
| --- | --- |
| `moduleResolution: "node"` | `"nodenext"` (or `"bundler"` for bundler projects) |
| `importsNotUsedAsValues` / `preserveValueImports` | `verbatimModuleSyntax: true` (forces explicit `import type`) |
| Installing `@typescript/native-preview` for the Go compiler | Plain `typescript` 7.0 (the native port ships as `tsc`) |
| Manual `try`/`finally` for cleanup | `using` / `await using` (stable since 5.2) |
| Hand-written `esModuleInterop`-heavy CJS tsconfig | The modern `tsc --init` baseline (`nodenext`, `esnext`, `strict`, `isolatedModules`) |

## Gotchas
- With `verbatimModuleSyntax`, type-only imports and exports must use `import type` / `export type` or the build breaks. Node's native type stripping needs the same.
- 7.0 ships no programmatic API. Tools that embed the compiler (typescript-eslint, webpack loaders, Volar for Vue/Astro/Svelte/MDX) still need 6.0 installed side by side until the new API lands in 7.1.
- 7.0 hardens 6.0's defaults: `strict` is mandatory, `rootDir` defaults to `./`, `types` defaults to `[]` (list `["node"]` and friends explicitly), and ES5, AMD, SystemJS, and `baseUrl` are gone.
- Run a build on 6.0 before attempting 7.0; 6.0 makes deprecated options hard errors.

## Companion
[node.md](./node.md) covers native type stripping, which removes the build step for plain Node scripts. [vite.md](./vite.md) covers the bundler that transpiles types without checking them.

## Sources
- https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
- https://www.typescriptlang.org/docs/handbook/release-notes/
