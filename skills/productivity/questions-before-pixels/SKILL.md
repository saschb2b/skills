---
name: questions-before-pixels
description: Force UX questioning before any UI work, refactor, or redesign. Use when the user asks to design, redesign, restyle, polish, "fix", or "make nicer" a screen, component, page, or flow. Also use when the user describes a problem in UI terms ("the button is hard to find", "this form is confusing", "this page is ugly") and is about to reach for a visual fix — most UI-shaped complaints have UX-shaped causes.
---

# Questions Before Pixels

## The premise

In 2026, polished UI is the default of any generator. The bar that mattered ten years ago ("does it look good?") is no longer a moat. The work that actually moves outcomes is the questioning underneath: whether the screen should exist, what the user was doing before they arrived, what they're trying to accomplish in this exact moment.

Most "UX problems" are described in UI terms because UI is what people can point at. A UI-shaped complaint does not mean a UI-shaped fix.

## Step 1: Run the UI-vs-UX diagnostic before opening the design tool

| Symptom | Most likely fix |
|---|---|
| User can't find the action they need | UX — wrong screen, wrong moment, IA problem |
| User finds the action but doesn't trust it | UX — missing feedback, context, or consequence |
| User triggers the action, lands where expected, page looks dated | UI polish (genuinely cosmetic) |
| User completes the task but it "feels clunky" | UX — too many steps, missing defaults, the system is asking the user to think |
| User can't tell whether something happened | UX — missing or delayed feedback loop |
| Two screens look the same; user picks the wrong one | UX — those two screens probably shouldn't be two screens |
| User keeps doing what the warning says not to | UX — the warning is in the wrong place, design is fighting the workflow |

If most reported problems land on the cosmetic row, the team has good UX and a styling backlog. If they land elsewhere, redesigning the offending screen will not move the metric.

## Step 2: Run the twelve questions, in the order they tend to bite

The first three are the most skipped and the most expensive when missing.

1. **Should this screen exist at all?** Could the job be done by an inline action, a dialog, a default that removes the choice, a row in the existing list, or by not asking?
2. **What was the user doing thirty seconds before they arrived?** Screens are designed in isolation; they're used in flows. Anchor to the moment, not to the empty state.
3. **What is the user trying to accomplish in this exact moment, in their own words?** Not the feature name. If the team can't agree on a single sentence, the screen serves none of the unspoken intents well.
4. **Where should the eye land first, second, third?** If you can't name the first thing, the screen has no hierarchy.
5. **Is the next action obvious without scanning?** If users need to scan, the design has hoped rather than decided.
6. **What happens when the user is wrong?** Every interface is designed twice — for the happy path and for the wrong-click moment. Most ship only the first.
7. **What does the user already know, and what are you teaching them again?** Cut every confirmation, repetition, and re-entry you can't defend with a real failure mode.
8. **What does the screen look like empty / loading / partial / error / full / stale?** Six states. Designing only the "happy, full, fast" one is designing a fiction.
9. **How does the user know the action worked?** Action without feedback is the most common bug in UI design.
10. **What happens after the user succeeds?** The post-success moment is high-leverage and usually wasted.
11. **Is the friction proportional to the consequence?** Reversible action = one click + undo. Irreversible high-stakes action = slower on purpose, with the affected thing named specifically (not "Are you sure?").
12. **Did anyone watch one real user try this end to end?** One user catches ~33% of issues. Five catches 85%. The marginal cost is hours.

## Step 3: Place questions in the workflow, not in a separate review gate

| Stage | Questions to ask |
|---|---|
| At the ticket | 1, 2, 3 — should this exist, what came before, what is the user trying to do |
| At the first sketch | 4, 5, 6, 7 — hierarchy, next action, unhappy path, assumed knowledge |
| At high fidelity | 8, 9 — all the states, feedback model |
| Before handoff | 10, 11 — post-success, friction calibration |
| Before "done" | 12 — watch one real user |

If a review gate is the only place the questions live, the screen is already done and the cost of any answer is throwing the design away.

## When the user pushes back

If the user says "just make it look better", offer the two-minute version: questions 1, 2, and 5. *Should this exist, what came before, is the next action obvious.* Those three catch the majority of bad UI work that the cosmetic version would have shipped without noticing.

## Source

Based on [Questions Before Pixels](https://saschb2b.com/blog/questions-before-pixels) — UX in 2026 when polish is no longer the moat.
