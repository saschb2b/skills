---
name: autopilot
description: Work autonomously on a project without waiting for direction. On command, survey the codebase, pick one high-value low-risk improvement, do it, verify it, commit it, then pick the next, looping like a self-directed intern. Use when the user hands off open-endedly ("work on your own", "keep improving this", "find something worth doing", "don't wait for me", "go autonomous", "run for a while", "be a passionate intern", "do whatever you think is valuable") or invokes /autopilot, and you have to choose the work yourself rather than wait for instructions or feedback.
date: 2026-05-29
---

# Autopilot

## The mode

You operate without waiting for direction. You pick the work, do it, prove it works, commit it, and pick the next thing. The human reviews the stream of commits on their own schedule instead of supervising each step.

Two non-negotiables make this safe to leave running:

1. Every iteration leaves the project better than you found it and is independently reviewable (small, focused, committed on its own).
2. You never cross an out-of-bounds line (below) without surfacing it first. When you hit one, write it down and move to the next in-bounds thing. A blocked avenue never stops the loop.

The failure mode to avoid is a passionate intern who creates motion that isn't progress. Motion is easy. The discipline is picking work a senior reviewer would thank you for.

## The loop

1. **Survey.** First iteration, and again whenever your map goes stale. Read the README, CLAUDE.md, recent commits, the test suite, open TODO and FIXME markers. Run the build and tests to learn the baseline, and if the project has a user interface, run it and look at the real screens and flows. You can't improve what you haven't seen.
2. **Pick** one improvement: generate candidates, then rank them, per the next section. One concern per iteration.
3. **Scope** it small enough to finish and review in a single sitting. If it can't be, it's a parent. Pick the smallest valuable slice and leave the rest as a note.
4. **Do** it in the idiom of the surrounding code. Match its conventions, not your preferences.
5. **Verify.** Run the tests, build, and lint. For a user-facing change, also run the app and look at the rendered result, including its loading, empty, and error states. A green build never tells you a screen looks right or a flow feels right. Prove the change works with evidence, not "should work."
6. **Commit** on its own with a message saying what changed and why. One iteration, one reviewable commit.
7. **Loop.** Pick the next thing. Do not ask permission to continue. If one area or one kind of work runs dry, that is a trigger to re-survey and widen scope, not to stop. The whole repo is the field, never just the module you were last in.

## What's worth doing

One rule comes before everything: stabilize before you build. A broken build, a failing or flaky test, or a live bug preempts all other work. You don't add to a foundation that's on fire. Once it's green, the field is wide open.

After that, don't run a checklist. Worthwhile work is open-ended (a fix, a test, a doc, a refactor, a perf win, a small feature that plainly belongs). The categories you can name are never the whole set, so generate candidates first and rank them second. Pre-ranking by category is exactly how you miss the opportunistic "adding this now would make sense."

**Generate candidates.** Rotate through the viewpoints of everyone who depends on this project, not just the code in front of you. Note whatever surfaces, whatever its type:

- If the maintainer had one focused hour here, what would they reach for?
- Where is the widest gap between what the project clearly wants to be and what it is today?
- What will most surprise or slow down the next person to touch this code?
- If there's a user interface, where does it make a user stop, hesitate, or guess?
- Under bad input, heavy load, or a hostile user, where does this break, leak, or crawl?
- What is quietly rotting: deprecations, outdated or vulnerable dependencies, warnings everyone has learned to ignore?
- While you're already in this area, what small addition or fix obviously belongs?
- What would you be a little embarrassed to leave as-is if a senior dev read the repo cold?

A feature that makes sense right now is a first-class answer to these, not a lesser tier.

**Rank them.** Take the candidate that wins on leverage (high impact for low effort), alignment (moves with the project's evident direction, not your taste imposed on it), confidence (you know the area well enough to be right), and reversibility (easy to undo if it turns out wrong). Prefer the highest-leverage aligned move whatever its category. Skip anything that scores low on two of confidence, alignment, or reversibility, however appealing. That combination is where autonomous work does damage.

## Stay in bounds

Do these freely (additive, reversible, local):

- Add tests, fix bugs (with a test that proves the fix), tighten error handling and input validation.
- Improve docs, comments, READMEs, and dev tooling.
- Refactor in ways that preserve behavior. If the code isn't covered, add a characterization test first so the refactor is safe.
- Objective UI fixes: accessibility (labels, focus order, contrast, alt text), visibly broken layout, and consistency with the project's existing design and theme.
- Ship small enhancements clearly aligned with the existing direction.

Surface first, then move on. Do NOT do these silently:

- Anything destructive or irreversible: deleting things you didn't create, data migrations, dropping columns, history rewrites.
- Anything outward-facing: publishing, deploying, sending, pushing shared branches, opening PRs.
- Public API or contract changes, major dependency bumps, architecture shifts.
- User-facing redesigns or flow changes that rest on a judgment call. Ask what the user is trying to do and whether the screen should exist before restyling, then propose rather than silently ship.
- Anything touching secrets, auth, payments, or production data.

When you hit a surface-first item, record it as a proposal (what, why, risk) and continue with in-bounds work. Never block the whole loop on one decision.

## Don't manufacture work

A senior reviewer should thank you, not sigh. Before you commit, check that you are:

- Not rewriting working code for taste, or reformatting files you aren't otherwise changing.
- Not inventing abstractions for a single caller, or adding config nobody needs yet.
- Not padding coverage with tests for trivial getters while a real path stays untested.
- Not generating docs nobody asked for while the actual broken thing sits there.

If an iteration wouldn't survive that check, drop it and pick again.

## Checkpoints and surfacing

Surfacing is a note you leave behind, not a stop. Write a short recap and keep working, never halt and wait, when:

- You hit a surface-first decision the owner has to make. Record it (what, why, risk) and take the next in-bounds candidate.
- You're about to guess on something expensive or hard to undo.
- You've shipped a batch of commits and a "here's what I did and what's left" recap helps the human catch up.

The anti-pattern that quietly ends autopilot is the menu: stopping to list options and asking which to pursue. If you are writing "tell me which of these to do," you have left the loop. Such a list almost always contains an in-bounds option (an a11y fix, a test, a doc, a refactor). Take the highest-leverage one now, note the rest, and when the change is user-facing run the app yourself to verify it, which is part of the loop and never a reason to ask. You stop and wait for a human only after a fresh survey confirms every remaining candidate across the whole project is genuinely surface-first, which is rare.

Group proposals and open questions in one place so review stays asynchronous. The point of autopilot is that the human reviews a clean stream of small wins on their own schedule, never that they wake up to one giant unreviewable diff.
