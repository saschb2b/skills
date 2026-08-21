---
type: Library Notes
title: "NgRx"
description: "NgRx is Angular's dominant state library (its Redux Toolkit)."
tags: [javascript, data]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# NgRx

**Verified 2026-08-20.** Check the installed `@ngrx/store` (or `@ngrx/signals`) version first; re-verify if newer than below.

**Current stable**: v21 (21.1.1, Jun 2026; tracks the Angular major). v22 is prerelease only (rc, for Angular 22); v21 still runs on Angular 22. **LLM default bias**: `StoreModule.forRoot`/`EffectsModule.forRoot` NgModules, class-based `@Injectable` effects, hand-written action and reducer boilerplate, `select` + async pipe, and not knowing SignalStore exists.

## The shift
NgRx is Angular's dominant state library (its Redux Toolkit). The big modern shift is **SignalStore** (`@ngrx/signals`): a signal-based store composed from features, recommended for component and feature state. The classic global `Store`/`Effects` is still supported but uses functional idioms now (`createFeature`, `createActionGroup`, `provideStore`, functional effects).

## Stop / Start
| Stop (LLM default) | Start (current NgRx) |
| --- | --- |
| Not knowing SignalStore exists | `signalStore(withState, withComputed, withMethods, withHooks, withEntities)` + `patchState`, `rxMethod` |
| `StoreModule.forRoot` / `EffectsModule.forRoot` | `provideStore(...)` / `provideEffects(...)` (and `provideState(feature)`) |
| Class `@Injectable()` effects | Functional effects: `createEffect(() => ..., { functional: true })` |
| Hand-written `createAction` + switch reducers | `createActionGroup` + `createFeature` (auto-generated selectors) |
| `store.select(...)` + `async` pipe | `store.selectSignal(...)` (or SignalStore signals) for zoneless reads |

## SignalStore in one snippet
```ts
export const CounterStore = signalStore(
  withState({ count: 0 }),
  withMethods((store) => ({
    increment: () => patchState(store, (s) => ({ count: s.count + 1 })),
  })),
);
```
Provide at the component (`providers: [CounterStore]`) or globally (`signalStore({ providedIn: 'root' }, ...)`). State is protected from external mutation by default.

## Gotchas
- All `@ngrx/*` packages release in lockstep with the Angular major; pin them together.
- `tapResponse`, `mapResponse`, and `concatLatestFrom` live in `@ngrx/operators` now.
- Reach for SignalStore for component and feature state; the global Store for app-wide Redux-style state with devtools and strict action auditing.

## Companion
The framework in [../frameworks/angular.md](../frameworks/angular.md).

## Sources
- https://ngrx.io/guide/signals/signal-store
- https://ngrx.io/guide/store/feature-creators
