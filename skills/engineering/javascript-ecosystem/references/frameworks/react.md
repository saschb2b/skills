---
type: Library Notes
title: "React"
description: "React 19 made Actions, the `use()` primitive, `ref` as a regular prop, and `<form action>` first-class; 19.3 added stable View Transitions, Fragment refs, and `browser()`."
tags: [javascript, frameworks]
generated: { by: claude-code/unversioned, at: 2026-09-09T00:00:00Z }
---
# React

**Verified 2026-09-09.** Check the installed `react` version first; re-verify if newer than below.

**Current stable**: 19.3 (Sep 9, 2026). 19.3 stabilized `<ViewTransition>` and `addTransitionType`, added `ref` on `<Fragment>`, `browser()` in `react-dom`, and Trusted Types support. 19.2 (Oct 2025) added stable `<Activity>` and `useEffectEvent`. React Compiler 1.0 shipped Oct 2025 and is still the current line. **LLM default bias**: React 16.8 through 18. Class-component muscle memory, defensive `useMemo`/`useCallback`/`React.memo`, `useEffect` data fetching, `forwardRef`.

## The shift
React 19 made Actions, the `use()` primitive, `ref` as a regular prop, and `<form action>` first-class. The React Compiler auto-memoizes at build time, so hand-written memoization is mostly noise. In framework setups, Server Components and Server Actions are the default mental model, not an experiment. 19.3 moved animation into React itself: `<ViewTransition>` animates enter, exit, update, and shared-element moves for any Transition, Suspense reveal, or `useDeferredValue` change, on top of the browser View Transition API.

## Stop / Start
| Stop (LLM default) | Start (React 19.3 + Compiler) |
| --- | --- |
| Defensive `useMemo` / `useCallback` / `React.memo` | Enable the Compiler and let it memoize |
| `forwardRef(...)` to pass a ref | Accept `ref` as a normal prop |
| `useEffect` + state to read a promise or context | `use(promise)` / `use(context)` during render |
| Controlled `onSubmit` + manual pending flags | `<form action={fn}>` with `useActionState`, `useFormStatus`, `useOptimistic` |
| `ReactDOM.render` (legacy entry) | `createRoot` / `hydrateRoot` from `react-dom/client` |
| Treating RSC as experimental | RSC + Server Actions as the framework default |
| Framer Motion or `AnimatePresence` for route and list enter/exit | `<ViewTransition>` around the subtree, `addTransitionType('next')` inside `startTransition` to pick the animation |
| A wrapper `<div>` just to get a DOM handle for a group of siblings | `<Fragment ref={ref}>` and the `FragmentInstance` methods (`focus`, `observeUsing`, `addEventListener`, `getClientRects`) |
| `useEffect` + `mounted` state to skip SSR for browser-only UI | `use(browser())` from `react-dom` inside a `<Suspense>` boundary |
| A `'use client'` `Provider` wrapper only to pass server data into a context | Render the `'use client'`-exported context directly from a Server Component (`<UserContext value={...}>`) |

## Gotchas
- React 19 removed string refs, legacy context, `propTypes`, and `ReactDOM.render`. Run the official codemods on upgrade.
- The Compiler is opt-in per build tool (Babel, Vite, Metro, Rsbuild, and Bun 1.4 has it built in) and assumes the Rules of React. Lint with `eslint-plugin-react-hooks` v7 (7.1.x) at error before enabling.
- Keep manual memoization only for referential identity passed to non-React consumers, genuinely expensive non-render work, or effect-dependency stability. The compiler handles everything else, so do not strip these three cases blindly.
- `use()` follows render purity but, unlike a hook, may be called conditionally. 19.3 adds a DEV warning when a conditional `use()` looks like it unblocked a component by accident.
- The Actions hook is `useActionState` (returns `[state, action, isPending]`), not the Canary-era `useFormState`. 19.3 renamed its messages from "form state" to "action state". `propTypes` and `defaultProps` are removed for function components; use TypeScript types and default parameters.
- `<ViewTransition>` only animates updates inside a Transition (`startTransition`, Suspense reveal, `useDeferredValue`); a plain `setState` still commits instantly. It is DOM-only in 19.3, and images and fonts inside it suspend until loaded so the animation does not flicker.
- `use(browser())` suspends on the server only, so it needs a Suspense fallback above it; `react-dom/server` exposes `onBrowserBailout` to observe those subtrees.
- 19.3 renders independent Transitions separately, so one slow Transition no longer holds up unrelated ones; code that relied on them batching into one commit may see intermediate states.

## Companion
The strict `eslint-plugin-react-hooks` config and the five silent compiler-bail patterns are inlined in [react-rules.md](./react-rules.md). The standalone **react-compiler** skill is an optional deeper dive on the same material; it is not required. For animation libraries that predate `<ViewTransition>`, see [../ui/motion.md](../ui/motion.md).

## Agent skills
React ships an official `llms.txt` (react.dev/llms.txt) for agent context. There is no first-party React skill; the popular `react-best-practices` skill is Vercel's (`npx skills add vercel-labs/agent-skills`), not from the React team.

## Sources
- https://react.dev/versions
- https://react.dev/blog/2026/09/09/react-19-3
- https://react.dev/blog/2025/10/01/react-19-2
- https://react.dev/blog/2024/12/05/react-19
- https://react.dev/blog/2025/10/07/react-compiler-1
