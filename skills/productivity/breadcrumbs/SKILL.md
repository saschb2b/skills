---
name: breadcrumbs
description: Capture the answer to a codebase investigation so the next agent reads it instead of re-deriving the same thing. Fires when you catch yourself saying "first I need to understand how X works before I can do Y", or you just finished tracing something (how a flow works, where a value is configured, why a workaround exists, how two modules connect). Leave a durable breadcrumb recording the finding, the file-and-line anchors that prove it, and a freshness stamp, written where the next agent already looks (CLAUDE.md, AGENTS.md, or a linked notes file). It also covers the read side, checking the trail before starting any non-trivial investigation. Use when starting or finishing codebase investigation, when about to grep and read your way to an understanding later agents will also need, when the same discovery keeps repeating across sessions, or when you invoke /breadcrumbs.
tags: [workflow, documentation, meta]
date: 2026-07-08
---

# Breadcrumbs

## The reflex

You catch yourself typing "first I need to understand how X works" or "before I can do Y, let me trace Z." You grep, you read, you build the mental model, you do the task. Then the model evaporates when the turn ends, and the next agent types the same sentence and repeats the same search. Breadcrumbs breaks that loop: when an investigation produces reusable understanding, you leave the answer behind where the next agent will find it.

Three moves, in order of when they bite:

1. **Read before you dig.** Check the trail before you start searching.
2. **Drop a breadcrumb after you dig.** When the investigation produced reusable understanding, record the answer.
3. **Keep the trail honest.** When you rely on a breadcrumb, verify its anchors still hold; fix or delete it if they don't.

## Read before you dig

Before any non-trivial investigation, check the trail (see "Where the trail lives"). If a breadcrumb already answers your question and its anchors still hold, use it instead of re-searching. That is the entire payoff. A skill that only ever writes is a diary, not a trail. The read move is what makes the write move worth anything, so it comes first.

## Drop a breadcrumb

Not every fact earns one. The bar is reusable, non-obvious, and stable enough to outlive the task.

| Breadcrumb-worthy | Skip it |
| --- | --- |
| How a flow actually works end to end | Anything one grep reveals |
| Where a value is really configured (not where you'd guess) | What the README or CLAUDE.md already states |
| Why a workaround or odd choice exists | Ephemeral task state ("halfway through renaming X") |
| How two modules or services connect | A fact that changes every week |
| A convention the repo follows but never documents | Your personal preference about the code |

Test: if the next agent would spend more than a couple of minutes re-deriving it, drop the breadcrumb.

A breadcrumb has four parts (a fifth when the reason matters):

- **Topic**. Phrased as the question a future agent will actually search for, not a title.
- **Answer**. One to five lines. The conclusion, not the transcript of how you found it.
- **Anchors**. The `file:line` and symbol names the answer rests on. Anchors make a breadcrumb falsifiable: the next agent can spot-check them, so staleness becomes visible instead of silent. A breadcrumb with no anchors is a rumor.
- **Verified**. The date and short commit sha, so freshness is legible at a glance.
- **Why** (optional). The reason it is this way, when non-obvious. This is the line that stops the next person "fixing" a deliberate choice.

## Where the trail lives

The trail must live where the next agent already looks, or discovery fails and you are back to re-deriving. Prefer, in order:

1. **The repo's eagerly-read agent doc** (`CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `.github/copilot-instructions.md`). Agents load it every session for free, so a breadcrumb here is found without anyone knowing to look. Best for a handful of durable facts.
2. **A dedicated file linked from that doc** (`.agents/breadcrumbs.md`) once the trail outgrows a section. The eagerly-read doc points to it, so discovery still starts from a place agents already land.
3. **An OKF concept**, when the repo already keeps knowledge as an OKF bundle. Use the `okf` skill so each breadcrumb ships typed and cross-linked.

Discovery is the whole game. A perfect finding written where nobody looks gets re-derived anyway. Commit the trail by default so it travels with the code, survives the session, and helps humans too. Gitignore it only if the team wants agent scratch kept out of history.

## Keep the trail honest

Code drifts, so a breadcrumb can go stale. Anchors are the guard. When you rely on one, spot-check its anchors against the current code. If they no longer match, fix the breadcrumb or delete it in the same turn you noticed. A wrong breadcrumb is worse than none, because it is trusted: it sends the next agent confidently in the wrong direction. Never leave one you caught being stale behind you.

## Dogfood it

The clearest signal to drop a breadcrumb is you writing "first I need to understand X." That sentence means the answer is not yet on the trail. When you finish, put it there. The proof this skill works is that the same investigation never has to happen twice in the same repo.
