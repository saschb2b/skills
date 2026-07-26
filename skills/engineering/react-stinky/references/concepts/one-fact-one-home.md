---
type: Principle
title: "One Fact, One Home"
description: "Single source of truth for state; store the minimal fact at the lowest common ancestor of its readers and writers, derive everything else during render."
tags: [react, state, architecture, single-source-of-truth]
generated: { by: claude-code/unversioned, at: 2026-07-17T00:00:00Z }
sources:
  - resource: https://react.dev/learn/choosing-the-state-structure
    title: "React, Choosing the State Structure"
  - resource: https://react.dev/learn/sharing-state-between-components
    title: "React, Sharing State Between Components"
  - resource: https://react.dev/learn/thinking-in-react
    title: "React, Thinking in React, step 4"
---
# One Fact, One Home

Every fact the UI shows has exactly one authoritative home; everything else about it is **derived during render**. Two homes for one fact is a synchronization job nobody assigned, and it will be done late or wrong. This principle underlies the [catalog's](../catalog.md) categories 19 (redundant state), 20 (props in state), 21 (duplicated state), and 26 (effect for derived), and it is rule 1 of the [restructure pass](../restructure-pass.md).

## Choosing the fact

Store the **minimal** fact and derive the rest: the `selectedId`, not the selected object and its id; the raw list and the query, not also the filtered list; the `status` union, not three booleans that can contradict ([impossible states](impossible-states.md)). The test for "does this belong in state": it must survive across renders AND be underivable from props and other state. Fail either half and it is a variable, not state.

## Choosing the home

$$home(fact) = LCA(readers(fact) \cup writers(fact))$$

The lowest common ancestor of everyone who reads or writes it:

- Placed **lower** than a reader, the fact must be pushed up, which is where effect-data-to-parent (category 28) and paired-effect mirroring come from.
- Placed **higher** than needed, every intermediate layer forwards it, which is prop drilling (category 22).
- Two components needing the same fact means **lift it to their LCA**, not mirror it between them.

Ownership questions the LCA cannot settle (parent or the component itself) are the [controlled vs uncontrolled](controlled-uncontrolled.md) contract.
