---
type: Pattern Catalog
title: "The Nine Comments Worth Writing"
description: "The positive taxonomy of code comments, what each kind is for, the form it takes, and the smell it degrades into, plus the routing table for information that belongs somewhere other than a comment."
tags: [comments, documentation, patterns, code-quality]
generated: { by: claude-code/unversioned, at: 2026-07-26T00:00:00Z }
sources:
  - resource: https://antirez.com/news/124
    title: "Sanfilippo, Writing System Software: Code Comments"
  - resource: https://web.stanford.edu/~ouster/cgi-bin/book.php
    title: "Ousterhout, A Philosophy of Software Design, ch. 12 to 16"
  - resource: https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/
    title: "Atwood, Code Tells You How, Comments Tell You Why"
  - resource: https://martinfowler.com/bliki/CodeAsDocumentation.html
    title: "Fowler, CodeAsDocumentation"
  - resource: https://google.github.io/styleguide/cppguide.html#TODO_Comments
    title: "Google C++ Style Guide, TODO Comments"
  - resource: https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
    title: "Nygard, Documenting Architecture Decisions"
---
# The Nine Comments Worth Writing

The smell [catalog](./catalog.md) says what not to write. This says what to write. Every comment worth its line falls into one of nine kinds, and each kind has a shape. If a comment you are about to write does not fit one of them, that is the signal to check the [routing table](#where-everything-else-belongs) below, because the information probably belongs somewhere other than a comment.

The taxonomy adapts Sanfilippo's classification of comment types and Ousterhout's rule that a comment exists to record [what the code cannot express](./concepts/nonobvious-information.md). The ladder underneath all nine is in [why-not-what.md](./concepts/why-not-what.md).

## The shape rules, which apply to all nine

1. **Present tense, standing fact.** The code is not being changed; it is. "The label is the hit area" beats "wrapped the input in a label".
2. **No narrator.** No `I`, no `we`, no `let's`. The reader is alone with the file.
3. **No history the reader cannot see.** If a clause only resolves with the previous version in hand, it belongs in the commit message. See [comment-audience.md](./concepts/comment-audience.md).
4. **Load-bearing sentence first.** The reason, then the elaboration. Most comments should stop after the first sentence.
5. **Anchor to names, not positions.** "See `flushStaged`", never "see the block below".

## 1. Why comment (rationale)

The default kind and the most valuable. It records the force that made the code this shape: a constraint, a measurement, a spec, a platform limit, a tradeoff, a deliberate rejection of the obvious approach.

- **Earns its place when:** a competent reader would ask "why not the simpler thing?" and the code cannot answer.
- **Form:** the force, then the consequence. One or two sentences.
- **Example:** `// The label is the hit area. A bare 16px checkbox is under the 24px touch-target floor, and a label wrapping an input toggles it natively, so the target is the label's box rather than the checkbox's.`
- **Degrades into:** [diff-narration](./catalog.md) when the force is stated as a change ("made the target bigger"), and [false-comparative](./catalog.md) when the rejected alternative is the old code rather than the obvious one.

## 2. Contract comment (interface)

What a caller must know to use the thing correctly without reading its body. This is the doc comment, and it is the only kind that ships to people who never open the file.

- **Earns its place when:** the symbol is callable from outside its own module, or its correct use depends on anything the signature does not say.
- **Form:** one-line summary, then only the non-obvious. Units, ranges, null and empty semantics, ownership and lifetime, which errors and when, side effects, thread-safety, cost, and what the caller must guarantee first.
- **Example:**
  ```rust
  /// Returns the staged tree for `root`, or `None` if no session owns it.
  ///
  /// The caller must hold the session lock; the returned tree borrows from it.
  /// Cost is O(files in the bundle), so cache it across a render rather than
  /// calling per row.
  ```
- **Degrades into:** [signature-echo](./catalog.md) when it restates the parameter names, [lying-doc](./catalog.md) when it drifts from the signature, and [wrong-channel](./catalog.md) when it is written as `//` where the ecosystem reads `///`.
- The split between this and the next kinds is [interface vs implementation](./concepts/interface-vs-implementation.md), and mixing them is what makes doc comments rot.

## 3. Design comment (module or file header)

The shape of the whole file: what layer it is, what it owns, what it deliberately does not own, and how its parts relate. It is the map that stops the reader reconstructing the architecture from the bottom up.

- **Earns its place when:** the file has more than one moving part, or its role is not obvious from its name and location.
- **Form:** a short paragraph at the top. What this is, the one design decision that explains the rest, and the boundary ("all filesystem access for the agent host goes through here; nothing below this line touches disk directly").
- **Example:** `// Update flow. Installing is always an explicit user action; checking has two triggers, startup and the menu item, and both share the same debounce so a manual check right after launch does not double-fetch.`
- **Degrades into:** [banner-ceremony](./catalog.md) when it only restates the file name, and [essay-comment](./catalog.md) when it grows into architecture documentation that belongs in a doc.

## 4. Guide comment (navigation)

Section markers through a genuinely long procedure, so the reader can skim to the phase they need. The one legitimate "what" comment.

- **Earns its place when:** the routine is long, cannot reasonably be split, and has real phases. If it can be split, [should-be-a-name](./catalog.md) applies instead and extraction wins.
- **Form:** one short line per phase, naming the phase, not the lines.
- **Example:** `// Phase 2. Reconcile the staged tree against disk, dropping hunks whose base revision moved.`
- **Degrades into:** [step-narration](./catalog.md) when there is one per line rather than one per phase.

## 5. Teacher comment (domain knowledge)

The context the reader will not have and cannot derive from the code: the physics, the math, the wire format, the regulation, the business rule, the paper the algorithm comes from.

- **Earns its place when:** the code is a faithful implementation of something external, and correctness is judged against that external thing.
- **Form:** the rule or formula, plus a citation the reader can open. Keep it to what this code depends on.
- **Example:** `// Barnes-Hut: a cell is treated as one body when its width over distance is below theta (0.9 here), which is what makes repulsion O(n log n) instead of O(n^2).`
- **Degrades into:** [tutorial-voice](./catalog.md) when it teaches the language or the standard library instead of the domain.

## 6. Trap comment (the counterintuitive thing)

A warning about the thing that will bite the next person: a platform quirk, an upstream bug, a surprising API behavior, a change that looks safe and is not.

- **Earns its place when:** a plausible edit would break something with no local signal, or the code looks wrong and is right.
- **Form:** a standing prohibition with its reason. "Do not X, because Y" and, if it exists, the condition under which X becomes safe.
- **Example:** `// Do not hoist this read out of the loop. The observer mutates the map during iteration, and the cached size goes stale on the second pass.`
- **Degrades into:** [removal-eulogy](./catalog.md) when it is phrased as history ("we stopped hoisting this") instead of as a standing rule.

## 7. Checklist comment (deliberate coupling)

"If you change this, also change that." The honest admission that two places must move together and nothing enforces it.

- **Earns its place when:** the coupling is real and no mechanism in the language can hold it. Reach for the mechanism first; see [unenforced-invariant](./catalog.md).
- **Form:** name the other site precisely, by symbol or path, and say what breaks if they drift.
- **Example:**
  ```rust
  // Keep in sync with the discriminants in protocol.rs. The wire format is
  // positional, so a mismatch decodes silently into the wrong variant.
  ```
- **Degrades into:** [unenforced-invariant](./catalog.md) when a type, an exhaustive match, or a test could have held the rule instead, and [duplicated-rationale](./catalog.md) when the same note is pasted at both ends and drifts.

## 8. Debt comment (known, deliberate, dated)

Work not done, recorded where it will be found. The value is entirely in the metadata; a bare marker is decoration.

- **Earns its place when:** the shortcut is deliberate and someone would otherwise read it as finished work.
- **Form:** marker, owner or ticket, and the condition that triggers the work. Not a date unless the date is real.
- **Example:** `// TODO(ISSUE-412): drop the base64 shim once the host ships the binary channel. Costs one copy per frame until then.`
- **Degrades into:** [unowned-todo](./catalog.md) without the owner and condition, which also covers the undated temporal form ("for now", "currently", "temporarily") that is debt with no marker at all.

## 9. Provenance comment (this exists because it broke)

The reason a guard, a clamp, a retry, or a defensive check is there. Without it the code reads as paranoia and the next reader deletes it.

- **Earns its place when:** the necessity is invisible from the local types and contract.
- **Form:** the failure in present tense, not the incident in past tense. What arrives, what it does, what the user sees.
- **Example:** `// Empty ids arrive from the legacy importer and would key the cache at the root, serving one bundle's tree for every other.`
- **Degrades into:** [changelog-comment](./catalog.md) when written as "fixed the bug where...", which describes the repair rather than the standing hazard. The distinction is the whole point of [information routing](./concepts/information-routing.md).

## Where everything else belongs

If what you want to say is not one of the nine, route it. Every row here is a comment smell on the left and its correct home on the right.

| The information | Its home | Why not a comment |
| --- | --- | --- |
| The edit you just made | The commit message subject | The reader has the file, not the diff |
| Why the edit was needed now | The commit message body | Same, and `git log` keeps it findable forever |
| Why the code has this shape | **A comment.** This is the one | Nothing else is attached to the line |
| What the code does, step by step | The code, renamed | The code cannot go stale relative to itself |
| What a caller must know | A doc comment on the declaration | Callers do not read bodies |
| A rule that must hold | A type, an assertion, or a test | Prose does not fail the build |
| A behavioral claim | A test named after the claim | An unverified claim decays silently |
| A known defect or deferred work | A ticket, plus a debt comment linking it | Comments have no queue and no owner |
| The previous implementation | Git history | It is already there, losslessly |
| A convention that applies project-wide | CONTRIBUTING or the style config | It should not be repeated per file |
| A decision with weighed alternatives | An architecture decision record | Too big for a line, too important to lose |
| Background on the whole subsystem | A design doc or a knowledge bundle | A file header links to it in one line |

The reasoning behind the routing, and why the commit message is the specific destination for almost everything an agent wants to write, is in [information-routing.md](./concepts/information-routing.md) and [commit-message-craft.md](./concepts/commit-message-craft.md).

## How many comments

There is no ratio. The right count is one per non-obvious decision and zero per obvious line, which in ordinary application code lands well below what a coverage instinct produces. Two useful checks:

- **Every comment should survive the delete test.** Delete it. If nothing is lost that the code does not already say, it should not have been written.
- **Every non-obvious decision should survive the stranger test.** Hand the file to someone who has never seen it. Every "why is this like that?" they ask is a missing comment, and those are Pillar 3 findings.

Both are mechanized in [write-gate.md](./write-gate.md).
