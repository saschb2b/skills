---
type: Library Notes
title: "Cypress"
description: "Cypress is still actively developed (v16 moves Chromium network interception into the browser and removes `cy.exec()`, `cy.end()`, and `Cypress.env()`), but its position shifted to runner-up behind Playwright for new e2e projects."
tags: [javascript, testing]
generated: { by: claude-code/unversioned, at: 2026-09-09T00:00:00Z }
---
# Cypress

**Verified 2026-09-09.** Check the installed `cypress` version first; re-verify if newer than below.

**Current stable**: 16.0 (Sep 1, 2026; v15.0 GA Aug 2025). **LLM default bias**: Cypress 10 to 13, positioned as the leading or default e2e tool, with Cypress Cloud assumed necessary for parallelization.

## The shift
Cypress is still actively developed (v15 added AI-assisted authoring and a command-log refresh; v16 moves network interception for Chrome, Chromium, and Edge into the browser itself, with HTTP/2 and HTTP/3 support), but its position shifted to runner-up behind Playwright for new e2e projects. Its differentiators are time-travel debugging and the in-browser architecture. Its constraints are no real WebKit or Safari engine, JS and TS only, and paid Cloud for first-class parallelization.

## Stop / Start
| Stop (LLM default) | Start (Cypress 16) |
| --- | --- |
| Positioning Cypress as the default 2026 e2e choice | Playwright as the default; Cypress as a deliberate pick for its time-travel DX |
| Assuming Cypress tests Safari or WebKit | Chromium and Edge plus still-beta Firefox only; use Playwright for WebKit |
| Relying on free built-in parallelization | Cypress Cloud (paid) versus Playwright's free sharding |
| `cy.end()` to terminate a chain | A fresh `cy` chain (`cy.end()` was removed in v16) |
| `cy.exec()` for shell work | `cy.task()` (`cy.exec()` was removed in v16) |
| `Cypress.env('KEY')` in specs | `Cypress.expose()` on the config side and `cy.env()` in specs |
| `experimentalMemoryManagement`, `experimentalFastVisibility`, `experimentalSourceRewriting` | `manageBrowserMemory` (on by default), the `visibilityStrategy` option, and no source rewriting |
| Targeting Node 20, Angular 18 to 20, Vite 5 to 7, or Next.js 14 in component testing | Node 22, 24, or 26+; Angular 21 and 22, Vite 8, Next.js 15+ |

## Gotchas
- v16's native interception changes `cy.intercept()` behavior in Chromium browsers; requests no longer route through the Cypress proxy, so proxy-dependent assumptions (timing, header rewriting) need re-checking.
- `cy.type()` now defaults to a 0 ms keystroke delay (was 10 ms), which can expose races in debounced inputs.
- Cookie and storage commands (`cy.getCookie()`, `cy.getAllLocalStorage()`, and friends) are retry-able queries in v16, so assertions chained on them retry.
- CoffeeScript specs are no longer supported.
- Some core commands (`cy.url()`, `cy.go()`) use automation protocols instead of the browser window, which can change timing in edge cases.
- 15.21 added `cypress tap`, a command that gives an AI agent direct access to an open-mode session. 15.19 added TypeScript 7 support.

## Companion
[playwright.md](./playwright.md) is the default for new e2e suites and the usual migration target from Cypress.

## Sources
- https://docs.cypress.io/app/references/changelog
- https://docs.cypress.io/app/references/migration-guide
- https://github.com/cypress-io/cypress/releases
