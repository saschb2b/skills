---
type: Library Notes
title: "Angular testing (TestBed, Karma to Vitest)"
description: "Karma was deprecated (2023)."
tags: [javascript, testing]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# Angular testing (TestBed, Karma to Vitest)

**Verified 2026-08-20.** Check the test builder in `angular.json` and the installed Angular version first; re-verify if newer than below.

**Current stable**: Vitest is the default test runner for new projects, since Angular v21 and unchanged in v22 (Jun 2026). **LLM default bias**: Karma plus Jasmine as the default, and `TestBed.configureTestingModule({ declarations: [...] })` with NgModule declarations.

## The shift
Karma was deprecated (2023). Angular v20 removed its builder from the `application` build system and shipped experimental Vitest support, and v21 promoted Vitest to the stable default (`ng test` runs Vitest with jsdom), which v22 (Jun 2026) carries forward unchanged. TestBed remains the core utility, but standalone components go in `imports`, not `declarations`. Karma and Jasmine are still supported for existing projects.

## Stop / Start
| Stop (LLM default) | Start (current Angular) |
| --- | --- |
| Karma plus Jasmine as the default for new projects | Vitest (default since v21; `ng test`, the `@angular/build:unit-test` builder) |
| `TestBed.configureTestingModule({ declarations: [Cmp] })` | `TestBed.configureTestingModule({ imports: [Cmp] })` (standalone) |
| Reconfiguring `TestBed` after `createComponent` | Configure first; `createComponent` freezes the definition |
| Assuming a first-party Jest builder | Vitest is the supported path; Jest is community-only (`jest-preset-angular`) |

## Gotchas
- Migrating an existing project to Vitest is still experimental and needs the `application` build system; a `refactor-jasmine-vitest` schematic helps but does not cover every pattern.
- Community helpers: `ng-mocks` (mock declarations to isolate the unit) and `Spectator` (less TestBed boilerplate).

## Companion
The framework in [../frameworks/angular.md](../frameworks/angular.md); the Vitest runner itself in [vitest.md](./vitest.md).

## Sources
- https://angular.dev/guide/testing
- https://angular.dev/guide/testing/migrating-to-vitest
