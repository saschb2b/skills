# React Compiler rules (full teachable reference)

Self-contained reference for enabling the React Compiler safely, so this skill teaches the whole thing without any other skill installed. The standalone **react-compiler** skill is an optional deeper dive on the same material.

## Strict lint config

The compiler's lint rules live in `eslint-plugin-react-hooks` v6+ (the old `eslint-plugin-react-compiler` was merged in). `recommended` ships the important ones at `warn`, so CI that fails only on `error` skims past silent compiler bails. Promote them:

```js
// eslint.config.mjs
{
  rules: {
    "react-hooks/unsupported-syntax": "error",
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/incompatible-library": "error",
    "react-hooks/todo": "error",
    "react-hooks/syntax": "error",
    "react-hooks/capitalized-calls": "error",
    "react-hooks/rule-suppression": "error",
    "react-hooks/no-deriving-state-in-effects": "error",
    "react-hooks/void-use-memo": "error",
    "react-hooks/automatic-effect-dependencies": "error",
    "react-hooks/memoized-effect-dependencies": "error",
    "react-hooks/hooks": "error",
  },
}
```

`unsupported-syntax` is the single most important rule (catches silent bails); `todo` surfaces the most in practice; `rule-suppression` lists every `"use no memo"`.

## Five patterns that drop a component out of compilation

1. **Mutating props or closures during render** (`entity.lastSeen = Date.now()` in the body). Fix: compute a new value, or move the side effect into a handler/effect.
2. **Reading a ref during render** (`ref.current?.offsetWidth` in the body). Fix: move the read into `useEffect`/`useLayoutEffect`.
3. **Class components.** Not compiled at all. Convert to function components, or accept they stay unmemoized.
4. **Unsupported syntax inside an otherwise-fine component** (the biggest trap), silent unless lint is strict:
   - Reassigning a destructured prop (`value = value ?? def`). Fix: introduce a new variable.
   - A mutated counter captured in `.map()` lambdas (`globalIndex++`). Fix: precompute offsets and use `offset + i`.
   - A dynamic `import()` inside an effect. Fix: hoist to a module-level cached promise.
5. **The `"use no memo"` escape hatch.** Skips the function entirely. Each one is a performance cliff; treat it as a TODO and grep the count as a health metric.

| Failure mode | Rule that catches it |
| --- | --- |
| Mutation during render | `react-hooks/unsupported-syntax` |
| Ref read during render | `react-hooks/unsupported-syntax` |
| Class components | Not lintable (design choice) |
| Unsupported syntax | `react-hooks/unsupported-syntax`, `react-hooks/todo` |
| `"use no memo"` | `react-hooks/rule-suppression` |

## Cleanup is iterative

Once a component bails, downstream rules may not surface their own findings on it; analysis stops at the first failure. Fixing an upstream bail can reveal a second. First run gives the count; later runs give the truth.

## Source

From [The React Compiler at Eighteen Months](https://saschb2b.com/blog/react-compiler-year-in-review). The standalone **react-compiler** skill covers the same material if installed.
