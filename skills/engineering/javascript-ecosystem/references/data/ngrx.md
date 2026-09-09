---
type: Library Notes
title: "NgRx"
description: "NgRx is Angular's dominant state library (its Redux Toolkit); v22 tracks Angular 22 and turns union state slices into per-member deep signals."
tags: [javascript, data]
generated: { by: claude-code/unversioned, at: 2026-09-09T00:00:00Z }
---
# NgRx

**Verified 2026-09-09.** Check the installed `@ngrx/store` (or `@ngrx/signals`) version first; re-verify if newer than below.

**Current stable**: v22 (22.0.0, Aug 24, 2026; requires Angular 22). v21 stays the line for Angular 21 apps. **LLM default bias**: `StoreModule.forRoot`/`EffectsModule.forRoot` NgModules, class-based `@Injectable` effects, hand-written action and reducer boilerplate, `select` + async pipe, and not knowing SignalStore exists.

## The shift
NgRx is Angular's dominant state library (its Redux Toolkit). The big modern shift is **SignalStore** (`@ngrx/signals`): a signal-based store composed from features, recommended for component and feature state. The classic global `Store`/`Effects` is still supported but uses functional idioms now (`createFeature`, `createActionGroup`, `provideStore`, functional effects). v22 deepens the signal model: union state slices that contain an object literal now expose a `DeepSignal` per object member instead of one `Signal` over the whole union, and SignalStore gains resource extensions and dynamic deep signals.

## Stop / Start
| Stop (LLM default) | Start (current NgRx) |
| --- | --- |
| Not knowing SignalStore exists | `signalStore(withState, withComputed, withMethods, withHooks, withEntities)` + `patchState`, `rxMethod` |
| `StoreModule.forRoot` / `EffectsModule.forRoot` | `provideStore(...)` / `provideEffects(...)` (and `provideState(feature)`) |
| Class `@Injectable()` effects | Functional effects: `createEffect(() => ..., { functional: true })` |
| Hand-written `createAction` + switch reducers | `createActionGroup` + `createFeature` (auto-generated selectors) |
| `store.select(...)` + `async` pipe | `store.selectSignal(...)` (or SignalStore signals) for zoneless reads |
| `tapResponse(next, error, complete)` callbacks | `tapResponse({ next, error, complete })` (the callback signature is gone in v22) |
| `.eslintrc` registration of `@ngrx/eslint-plugin` | Flat config only (ESLint v8 support dropped in v22) |

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
- v22 type change: `state.user` typed `{ name: string } | null` is now `DeepSignal<{ name: string }> | Signal<null>` rather than `Signal<{ name: string } | null>`. Custom SignalStore features with generics over `signalState`, `signalStore`, or `deepComputed` may need their types adjusted.
- `tapResponse`, `mapResponse`, and `concatLatestFrom` live in `@ngrx/operators` now.
- The `router-store` data-persistence sub-package APIs are deprecated in v22.
- Reach for SignalStore for component and feature state; the global Store for app-wide Redux-style state with devtools and strict action auditing.

## Companion
The framework in [../frameworks/angular.md](../frameworks/angular.md).

## Sources
- https://ngrx.io/guide/migration/v22
- https://github.com/ngrx/platform/blob/main/CHANGELOG.md
- https://ngrx.io/guide/signals/signal-store
- https://ngrx.io/guide/store/feature-creators
