---
type: Library Notes
title: "Playwright"
description: "Playwright is the dominant modern end-to-end default, ahead of Cypress on satisfaction and adoption."
tags: [javascript, testing]
generated: { by: claude-code/unversioned, at: 2026-08-21T00:00:00Z }
---
# Playwright

**Verified 2026-08-20.** Check the installed `@playwright/test` version first; re-verify if newer than below.

**Current stable**: 1.62 (Jul 2026). **LLM default bias**: 1.2x to 1.3x patterns, recommending Cypress as the e2e default, and treating Playwright as a newer alternative rather than the incumbent.

## The shift
Playwright is the dominant modern end-to-end default, ahead of Cypress on satisfaction and adoption. It offers free parallelization and sharding, real multi-engine coverage (Chromium, Firefox, WebKit), and multi-tab and multi-context testing. Recent releases lean into agent-driven testing (auto-cleanup disposables, AI-optimized accessibility snapshots).

## Stop / Start
| Stop (LLM default) | Start (current Playwright) |
| --- | --- |
| Defaulting to Cypress for new e2e suites | Defaulting to Playwright |
| `page.waitForTimeout` and manual sleeps | Auto-waiting web-first assertions (`await expect(locator).toBeVisible()`) |
| CSS or XPath selectors as the primary locator | Role, text, and label locators (`getByRole`, `getByText`, `getByLabel`) |
| Manual browser and context teardown | `await using` disposables (1.59+) for automatic cleanup |
| Planning component tests on `experimental-ct-*` | The 1.62 stories-and-galleries model (`mount()` fixture), or Vitest Browser Mode |

## Gotchas
- 1.62 replaced the `experimental-ct-*` packages with a stories-and-galleries component model: `mount(storyId)` navigates to a gallery, mounts the story, and returns a scoped locator.
- 1.61 added a WebAuthn virtual authenticator (`browserContext.credentials`) and `page.localStorage` / `page.sessionStorage`; 1.62 added an `AbortSignal` option on most operations and WebP screenshots.
- The bundled browser is now Chrome for Testing builds.

## Companion
[cypress.md](./cypress.md) is the incumbent it usually replaces, and [vitest.md](./vitest.md) handles the unit layer below e2e.

## Sources
- https://playwright.dev/docs/release-notes
- https://github.com/microsoft/playwright/releases
