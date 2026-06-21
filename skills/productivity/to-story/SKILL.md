---
name: to-story
description: Reshape a draft ticket, Jira issue, or GitHub issue from an engineer's braindump into a real user story with INVEST-clean acceptance criteria, and split stories that are too large using SPIDR. Use when the user wants to write, refine, review, sharpen, or split a ticket / story / issue, or when they share a draft that reads like a note-to-self (commit hashes, file paths, "see Slack thread", no user in sight).
tags: [writing, planning, agile]
date: 2026-05-12
source_post: stories-not-braindumps
---

# Stories, Not Braindumps

## The test

A draft is a story if a designer, PM, or new engineer can read it cold and tell what's changing and why it matters. Otherwise it's a braindump — fine as a note to self, not yet a contract between roles.

## Step 1: Story or Task?

- **Story** — has a user, a value, and a "so that". A human (customer, operator, admin, internal user) benefits from the change.
- **Task** — has no direct user-facing value. Library upgrade, CI chore, dead code removal, infra migration. Real work, but no one will ask "what did this deliver?"

If the work touches a user-visible outcome, force it through the Story shape even if the engineer wrote it as a Task. "Migrate auth middleware to v2" is the implementation; "Users stay signed in across tab reloads" is the story.

## Step 2: Rewrite using the Connextra template

```
As a <role>, I want <goal>, so that <value>.
```

You don't have to keep the literal sentence shape. You do have to answer all three clauses somewhere:

1. **Who** is this for? If you can't name a role, it's probably a task.
2. **What** are they trying to do? In their words, not yours.
3. **Why** does it matter? The hardest clause. The one most worth keeping. The "so that" is what survives a refactor of the template.

## Step 3: Run INVEST as a sanity check

| Letter | Question | Most common failure |
|---|---|---|
| Independent | Can this be built without waiting on two other stories? | Hidden dependencies, sequence isn't named |
| Negotiable | Is the *how* still open? | Solution already baked into description |
| Valuable | Who benefits, and how? | Disguised task |
| Estimable | Could three engineers roughly agree on size? | Scope unclear |
| Small | Fits in a sprint? | Too big — go to Step 5 |
| **Testable** | Can a neutral reader tell when it's done? | **The most violated letter in practice** |

If the only failing letter is **S**, the story needs splitting (Step 5). Anything else, fix the framing before splitting.

## Step 4: Write acceptance criteria a non-author can verify

Use Given/When/Then or a bullet list of observable outcomes. The format matters less than this property: **a neutral reader can verify the story is done without asking the engineer.**

Bad: "the feature works correctly", "users can use X".
Good: "Given a signed-in user, when they reload the page, then they remain signed in."

Keep ACs separate from implementation notes. Implementation goes in Subtasks, a tech-design doc, or the PR description — not in the ACs.

## Step 5: Split too-big stories with SPIDR

Try each letter in order. You usually have an answer by the second or third.

- **S — Spike.** Is there a genuine unknown? Timebox it as a research ticket; the build work becomes the story *after* the spike lands.
- **P — Paths.** Multiple workflows or user journeys? Ship the happy path first; error paths and alternate flows follow.
- **I — Interfaces.** Is the UI doing most of the work? Plain input now, polished interaction (calendar picker, autocomplete) later.
- **D — Data.** Different shapes, ranges, locales? Start with the simplest data variant; broaden in follow-up stories.
- **R — Rules.** Multiple business rules stacked? Ship one rule end-to-end; add the others as separate stories.

Two rules of thumb for picking among candidate splits:
- **Prefer roughly equal-sized slices.** A 5-5-5 split gives product three real options. A 12-1-1 split gives them one real story and two rounding errors.
- **Prefer splits where slice one teaches you something.** If slice one confirms a usage pattern, exposes a data problem, or proves an integration works, slices two and three become cheaper to estimate and build.

**Do not split horizontally by technical layer** (backend story / frontend story / migration story). That breaks INVEST on Independent, Valuable, and Testable simultaneously — none of the slices delivers user-visible value on its own, and the integration cost cancels the speed gain.

## Definition of Ready / Done — two short checklists at sprint boundaries

**Ready:** has actor + outcome + reason; ≥1 testable AC; dependencies linked, not assumed; nobody walks out of refinement still unclear; fits in a sprint.

**Done:** ACs verified by someone who isn't the author; tests at the right level passing; merged and deployed; docs / release notes / announcements updated; ticket closed with a short note on what actually shipped (especially if scope changed).

## Source

Based on [Stories, Not Braindumps](https://saschb2b.com/blog/stories-not-braindumps) — writing Jira work the team can actually use.
