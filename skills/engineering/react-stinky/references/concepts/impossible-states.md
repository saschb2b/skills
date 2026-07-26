---
type: Concept
title: "Impossible States"
description: "Model state and props so invalid combinations cannot be expressed; discriminated unions, status unions over boolean sets, and compiler-enforced exhaustiveness."
tags: [react, typescript, type-design, discriminated-unions]
generated: { by: claude-code/unversioned, at: 2026-07-17T00:00:00Z }
sources:
  - resource: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
    title: "TypeScript, Discriminated Unions and Exhaustiveness checking"
  - resource: https://react.dev/learn/choosing-the-state-structure#avoid-impossible-states
    title: "React, Choosing the State Structure"
---
# Impossible States

Choose representations in which the invalid combinations **cannot be written down**. A type that permits `isSending && isSent`, or an error variant with no `errorMessage`, forces every consumer to handle states that should never exist, and eventually one exists anyway. This model powers the [catalog's](../catalog.md) categories 6 and 7 (props), 21 (state), 54, and 56 (exhaustiveness), and it is the type-level face of [one fact, one home](one-fact-one-home.md).

## The tools

Discriminated union
: One `|` union keyed by a literal discriminant, each arm carrying only its own fields, required where the arm needs them: `{ status: 'error'; errorMessage: string } | { status: 'success'; data: T }`. Narrowing on the discriminant makes the right fields appear and the wrong ones vanish. Arms that keep every field optional constrain nothing and are the smell wearing the fix's syntax (category 7).

Status union over boolean sets
: Async and mode state is one axis with N points, not N booleans with 2^N combinations: `type Status = 'idle' | 'loading' | 'success' | 'error'`. Contradictions become unrepresentable instead of untested (categories 6, 21).

`never` exclusion
: For mutually exclusive prop variants on a leaf component, `href?: never` in the arm that forbids it turns misuse into a compile error. Costs spreading ergonomics, so it suits leaves, not wrappers (category 7).

Exhaustiveness check
: A closed union handled in a `switch` ends with a `never` assignment in `default` (or a lookup typed `satisfies Record<Status, T>`), so adding a member breaks every handling site at compile time instead of silently rendering nothing (category 56).

## The boundary caveat

The technique needs a closed set. Data you do not control (a server-sent string) is an open set at the boundary; validate it into a closed union once (a schema parse), then let the closed type flow inward. Handling an open set as closed crashes on the first new value; handling a closed set as open is category 56.
