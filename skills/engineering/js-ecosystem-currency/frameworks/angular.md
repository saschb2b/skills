# Angular

**Verified 2026-06-04.** Check the installed `@angular/core` version first; re-verify if newer than below.

**Current stable**: 21 (Nov 2025); 22 releasing the first week of June 2026. **LLM default bias**: Angular 2 through 16. NgModules everywhere, Zone.js, `*ngIf`/`*ngFor`, RxJS for everything, constructor injection.

## The shift
Angular is signal-first and zoneless. Signals are the primary reactivity primitive, standalone components are the default (no NgModules), built-in control flow (`@if`/`@for`/`@switch`) replaces structural directives, and zoneless change detection is production-ready. Signal Forms and resource signals (`httpResource`, `resource`) graduate to stable across v21 and v22.

## Stop / Start
| Stop (LLM default) | Start (current Angular) |
| --- | --- |
| `NgModule` + `declarations` | Standalone components (default since v17; no `standalone: true` needed from v19) |
| `*ngIf` / `*ngFor` / `*ngSwitch` | `@if` / `@for` (with `track`) / `@switch` |
| Zone.js change detection | `provideZonelessChangeDetection()` |
| `@Input()` / `@Output()` decorators | `input()` / `output()` / `model()` signal functions |
| Constructor injection | `inject()` |
| `BehaviorSubject` for local component state | `signal()` / `computed()` / `effect()` |
| `HttpClient` + manual subscribe for reads | `httpResource()` / `rxResource()` / `resource()` |

## Gotchas
- Migrate with `ng update` plus the official schematics (control-flow, standalone, signal inputs, inject), not by hand.
- `@for` requires a `track` expression. Omitting it is an error, unlike `*ngFor`'s optional `trackBy`.
- Zoneless needs OnPush-correct or signal-driven components. Not all third-party libraries are zoneless-ready yet.

## Sources
- https://angular.dev/reference/releases
- https://angular.dev/guide/signals
- https://github.com/angular/angular/releases
