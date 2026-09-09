---
type: Library Notes
title: "Jotai"
description: "The v2 API exposed a framework-agnostic store and split vanilla from React; v3 (Sep 2026) keeps that atom API, goes ESM-only, and moves `atomFamily` and `loadable` out of core."
tags: [javascript, data]
generated: { by: claude-code/unversioned, at: 2026-09-09T00:00:00Z }
---
# Jotai

**Verified 2026-09-09.** Check the installed `jotai` version first; re-verify if newer than below.

**Current stable**: v3.0 (Sep 8, 2026); v2.20 is the last v2 line. **LLM default bias**: v1 (Recoil-inspired). No exposed store API, and `useAtom` behavior where an atom getter auto-resolved promises. Models that know v2 still reach for `atomFamily` and `loadable` from `jotai/utils`, which v3 removed.

## The shift
The v2 API exposed a framework-agnostic store (`createStore()` with `store.get`/`store.set`/`store.sub`) and split vanilla (`jotai/vanilla`) from React (`jotai/react`), so atoms can be read and written outside React. Async atoms became "just atoms with promise values": the getter returns the promise, only the `useAtom` hook resolves it. v2 is intentionally not Recoil-compatible. v3 is "mostly backward-compatible": the atom and store API is unchanged, but the package is ESM-only, exposes only its public entry points, and drops the deprecated utilities and hook options.

## Stop / Start
| Stop (Jotai v1 / v2 leftovers) | Start (Jotai v3) |
| --- | --- |
| Treating Jotai as having no store handle | `const store = createStore(); store.set(fooAtom, 'foo')` |
| Expecting an atom `get` to auto-await an async dep | `get` returns the promise; `await` it or read via `useAtom` |
| Importing everything from `jotai` for non-React use | `jotai/vanilla` for core, `jotai/react` for hooks |
| `atomFamily` from `jotai/utils` | `atomFamily` from the separate `jotai-family` package |
| `loadable(asyncAtom)` from `jotai/utils` | `unwrap(asyncAtom)` (`loadable` was removed) |
| The `delay` option on `useAtom` / `useAtomValue`, or `setSelf` in a read function | Neither exists in v3; restructure with a derived atom |
| `require('jotai')` or deep imports into `jotai/esm/...` | ESM only, public subpaths only (`jotai`, `jotai/utils`, `jotai/vanilla`, `jotai/react`) |
| Babel plugins from `jotai/babel` | The `jotai-babel` package |

## Gotchas
- v3 requires React 18+, TypeScript 5.5+, and Node 22.12+, and ships ES2020 output with no CJS, UMD, or SystemJS builds.
- The v1 to v2 break was async-atom and store-API behavior; the v2 to v3 break is packaging plus removed utilities. Simple synchronous atom code survives both.
- `useAtomValue` has a subtle mount-timing change in v3; v3 adds `useAtomValueRaw` (React 19 oriented) and `useAtomValueRawSync` for callers that need the older synchronous read.
- Jotai is bottom-up atomic client state, good for fine-grained derived state. Like Zustand, it is not a server cache.
- Devtools live in the separate `jotai-devtools` package.

## Companion
For fetched server data, see [tanstack-query.md](./tanstack-query.md).

## Sources
- https://github.com/pmndrs/jotai/releases/tag/v3.0.0
- https://github.com/pmndrs/jotai/blob/main/docs/guides/migrating-to-v3.mdx
- https://jotai.org/docs/guides/migrating-to-v2-api
