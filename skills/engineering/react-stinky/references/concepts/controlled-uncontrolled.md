---
type: Concept
title: "Controlled vs Uncontrolled"
description: "Who owns a piece of interactive state, the value/onChange/defaultValue contract that encodes the answer, and the key-remount reset that follows from it."
tags: [react, state, forms, api-design]
generated: { by: claude-code/unversioned, at: 2026-07-17T00:00:00Z }
sources:
  - resource: https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components
    title: "React, controlled and uncontrolled components"
  - resource: https://react.dev/reference/react-dom/components/input
    title: "React, input reference"
  - resource: https://react.dev/learn/preserving-and-resetting-state
    title: "React, Preserving and Resetting State"
---
# Controlled vs Uncontrolled

The question behind every input-like API: **who owns this state, the parent or the component?** Everything in the [catalog's](../catalog.md) categories 8, 20, and 31 is this question answered badly or inconsistently.

Controlled
: The parent owns the state. The component renders `value` and reports every change through `onChange`; it holds no copy. The parent can therefore validate, transform, or reject changes, and the value has one home ([one-fact-one-home](one-fact-one-home.md)).

Uncontrolled
: The component owns the state. The parent may seed the first render through `defaultValue` (the name is the contract: later changes are intentionally ignored) and reads the result on events or via a ref.

## The contract

One trio per independent dimension, using the native names so consumers' instincts transfer: `value`/`onChange`/`defaultValue` for the general case, `checked`/`onChange`/`defaultChecked` for booleans, `open`/`onOpenChange`/`defaultOpen` for disclosure. Invented synonyms (`toggled`, `startExpanded`, `initialDate`) discard that transfer for nothing.

## The rules that follow

- **Never flip modes mid-life.** A `value` fed `undefined` on the first render mounts uncontrolled and flips controlled when data arrives; React warns and the field can reset. Keep it controlled from the first render (`value={user?.name ?? ''}`).
- **Reset by remount, not by effect.** When state should restart because the subject changed, change `key={id}` at the call site and let React rebuild the subtree; a `resetTrigger` prop plus `useEffect` re-implements `key`, worse (categories 8, 31).
- **Copying a prop into state is a mode error.** `useState(props.value)` takes ownership while looking like it follows the parent; nothing syncs later changes (category 20). Either stay controlled (read the prop) or be honestly uncontrolled (`defaultValue`).
