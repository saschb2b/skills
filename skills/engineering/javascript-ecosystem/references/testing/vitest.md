---
type: Library Notes
title: "Vitest"
description: "Vitest is the default test runner for Vite-based projects, having displaced Jest for new Vite, React, Vue, and Svelte work; v5 (Sep 2026) clears mocks by default, nests projects, and adds a browser trace viewer."
tags: [javascript, testing]
generated: { by: claude-code/unversioned, at: 2026-09-09T00:00:00Z }
---
# Vitest

**Verified 2026-09-09.** Check the installed `vitest` version first; re-verify if newer than below.

**Current stable**: 5.0 (Sep 3, 2026; 4.0 GA Oct 2025, 4.1 Mar 2026). Requires Vite 6.4+ and Node 22.12+. **LLM default bias**: 0.x and 1.x config patterns, the assumption that Jest is the default runner, treating browser mode as experimental, and tests that silently depend on mock state leaking between cases.

## The shift
Vitest is the default test runner for Vite-based projects, having displaced Jest for new Vite, React, Vue, and Svelte work because it reuses the Vite config and transform pipeline and runs ESM and TS natively. v4 made Browser Mode stable, so component tests run in a real browser via Playwright instead of JSDOM. v5 tightens defaults (mocks cleared before each test, strict locators, unawaited async assertions fail), makes projects nest and inherit root config, adds `vi.when` for per-argument mock behavior, rewrites benchmarks as test-context fixtures, and ships a trace viewer for Browser Mode.

## Stop / Start
| Stop (LLM default) | Start (Vitest 5) |
| --- | --- |
| Reaching for Jest by default in a Vite project | Vitest, reusing the existing `vite.config.ts` transforms |
| The `workspace` config field | `projects` (`workspace` was removed in v4); inline projects inherit root config in v5 |
| Treating browser testing as experimental or JSDOM-only | Stable Browser Mode (`browser.provider: 'playwright'`) for real-DOM tests |
| Importing browser context from `@vitest/browser/context` | Import from `vitest/browser` |
| Expecting `vi.restoreAllMocks()` to reset `vi.fn()` | `vi.resetAllMocks()` for those (`restoreAll` only undoes `spyOn`) |
| `vi.mock()` inside a `describe` or helper function | `vi.mock()`, `vi.unmock()`, and `vi.hoisted()` at module top level only (v5 throws otherwise) |
| `mockImplementation` with an `if` ladder over arguments | `vi.when(fn).calledWith(args).thenReturn(value)` |
| `bench()` imported at module level | `bench` as a test-context fixture inside `test()` |
| `test.sequential` / `describe.sequential` | `concurrent: false` |
| `expect(promise).resolves...` without `await` | Always `await` async assertions (unawaited ones fail the test in v5) |

## Gotchas
- Config lives in `vitest.config.ts`, merged with `vite.config.ts` via `mergeConfig`. Use the `test` key.
- `clearMocks` defaults to `true` in v5. Set `clearMocks: false` to restore the old cross-test mock state, but treat needing that as a smell.
- `-t` / `testNamePattern` now matches the `suite > test` full name, not space-separated fragments.
- Browser Mode in v5: locators are strict by default, `toHaveTextContent` is exact (use `toMatchTextContent` for partial), and `render()` in the Vue and Svelte packages is async.
- Reporter and attachment output consolidates under one `.vitest/` directory; add it to `.gitignore`.
- Vitest no longer looks for a config in parent directories, and `VITEST_WORKER_ID` / `VITEST_POOL_ID` are 1-based.
- Removed entry points (`vitest/reporters`, `vitest/coverage`, `vitest/environments`, and others) mean custom reporters need the public `vitest` exports; `@vitest/browser-webdriverio` moved to community maintenance.
- Fake timers now mock `Temporal` alongside `Date`; opt out with `fakeTimers.toNotFake`.
- v4 added an `agent` reporter tuned for low-token AI-agent output; 4.1 added test tags and `--detect-async-leaks`.

## Companion
Vite paradigm notes in [../tooling/vite.md](../tooling/vite.md). Component assertions in [testing-library.md](./testing-library.md).

## Sources
- https://vitest.dev/blog/vitest-5
- https://vitest.dev/guide/migration.html
- https://vitest.dev/blog/vitest-4
