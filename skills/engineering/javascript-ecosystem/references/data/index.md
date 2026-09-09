# Client state and data fetching

- [Jotai](jotai.md) - The v2 API exposed a framework-agnostic store and split vanilla from React; v3 (Sep 2026) keeps that atom API, goes ESM-only, and moves `atomFamily` and `loadable` out of core.
- [NgRx](ngrx.md) - NgRx is Angular's dominant state library (its Redux Toolkit); v22 tracks Angular 22 and turns union state slices into per-member deep signals.
- [Pinia](pinia.md) - Pinia is the official, default Vue store; Vuex is maintenance-only and should not be reached for in new code.
- [Redux Toolkit (RTK + RTK Query)](redux-toolkit.md) - Redux is RTK now. Redux Toolkit is the official way to write Redux, and `createStore` is formally deprecated in the core.
- [SWR](swr.md) - SWR is Vercel's minimal stale-while-revalidate data hook, lighter than TanStack Query and Next-aligned.
- [TanStack Query (React Query)](tanstack-query.md) - v5 unified every hook on a single object argument (no positional overloads), and made Suspense first-class via dedicated `useSuspenseQuery`/`useSuspenseInfiniteQuery` where `data` is never typed...
- [Zustand](zustand.md) - v5 dropped React below 18, so it uses React's native `useSyncExternalStore` directly, and it removed the ability to pass a custom equality function to the `create`-returned hook.
