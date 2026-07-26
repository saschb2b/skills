---
name: comment-stinky
description: Detect code-comment smells in any language, explain the cost of each, and propose the rewrite. Built against the failure mode where a comment narrates the edit that produced it (now, no longer, previously, instead of the old X) rather than the standing reason the code has its shape, because the reader only ever has the file, never the diff. Six pillars and 37 categories cover change narration and diff residue, redundancy (restating the code, signature echo, banner ceremony), missing intent (magic constants, workarounds, swallowed errors, unstated invariants), truth and decay (stale and lying comments, dead anchors), placement and form (a comment that wants to be a name, a test, or a doc comment, unowned TODOs), and voice. Ships a four-question write gate and a taxonomy of the nine comments worth writing. Apply implicitly whenever you write or edit a comment or docstring, and when asked to comment, document, audit, or clean up comments in a codebase, diff, file, or snippet. Defers prose register to no-slop.
tags: [code-quality, comments, documentation, review]
date: 2026-07-26
---

# Comment Stinky

A code-comment smell detector and a write-time gate, in any language. It exists because of one specific failure mode. A coding agent's working context is a diff, so it writes comments aimed at whoever reviews that diff. The diff is transitory. The comment is permanent. One commit later the comment describes a state nobody can see, and the reader who needed to know why the code is shaped this way gets a paragraph about a change instead.

The rule the whole skill reduces to: **write for a reader who has only this file open and does not know that a change ever happened.** The reasoning behind it is in [comment-audience.md](./references/concepts/comment-audience.md), and why agents specifically break it is in [agent-context-collapse.md](./references/concepts/agent-context-collapse.md).

Three operating documents. Read the one the task needs. [taxonomy.md](./references/taxonomy.md) is the positive half, the nine kinds of comment worth writing and where every other kind of information actually belongs. [catalog.md](./references/catalog.md) is the smell catalog, six pillars and 37 categories with detection signals, fixes, exceptions, and sources. [write-gate.md](./references/write-gate.md) is the four-question gate plus the trigger-phrase table and the rewrite recipes.

## What it sniffs for

Six pillars, 37 categories, in [catalog.md](./references/catalog.md). The background models live as linked concepts under [references/concepts/](./references/concepts/index.md); read one when a finding needs the model explained, not just named.

1. **Change narration.** The signature agent smell. A comment that describes the edit rather than the code: diff narration (`now`, `no longer`, `used to`), ghost references to code that is not in the tree, comparatives measured against the deleted version, changelog text parked in the source, reviewer defense, prompt echo, session residue, eulogies for deleted code, commented-out code.
2. **Redundancy.** Comments that restate the code, doc comments that echo the signature, step-by-step narration of obvious lines, banner ceremony, and tutorial voice explaining the language rather than this code.
3. **Missing intent.** The comments that should exist and do not: unexplained constants and thresholds, workarounds with no named cause, deliberate deviations from convention, silent ordering dependencies, swallowed errors and empty blocks, unstated invariants, unexplained tradeoffs, and regression guards with no provenance.
4. **Truth and decay.** Comments that contradict the code, doc comments that lie about parameters or errors, anchors pointing at moved line numbers, files, symbols, and dead URLs, rationale copied to several sites that then drifts, and invariants stated only in prose that a type or assertion could hold.
5. **Placement and form.** Rationale at the wrong altitude, a comment that wants to be a name, a test, or a type, `//` where the ecosystem's doc-comment form is what tools read, essays where two sentences do, and debt with no owner, ticket, or condition (bare TODOs, and the undated "for now" that never gets listed anywhere).
6. **Voice.** First-person authorship, hedging, overclaiming safety nothing backs, and decoration.

## Scope modes

| Mode | Trigger | What to do |
| --- | --- | --- |
| Write gate | you are about to add or edit a comment, anywhere, at any time | Run the four questions in [write-gate.md](./references/write-gate.md) before the comment lands. This is the implicit mode and it is the point of the skill. |
| Self-check | you just finished an edit and are about to hand it over | Extract only the comment lines you added (command in [write-gate.md](./references/write-gate.md)) and gate each one. Cheap, and it catches the smell at the only moment it is free to fix. |
| Diff scan | "review the comments on this branch", a PR | Comment lines added or changed in the diff, plus the surrounding code needed to judge truth. |
| File or folder scan | files or directories named | Every comment, docstring, and doc comment in scope, judged against the code it sits on. |
| Repo sweep | "audit the comments in this codebase" | Prioritize the files with the highest comment density, the most recent churn, and the public API surface. Skip vendored, generated, and license headers. |
| Fragment sniff | a pasted function or comment | Only that surface. State what you assumed about the code off-screen. |
| Author mode | "comment this", "document this function" | Skip the scan. Pick the kind from [taxonomy.md](./references/taxonomy.md), write it, then gate it. |

## Workflow per target

1. Read the code before the comment. A comment can only be judged against what it sits on, and half the catalog is about the two disagreeing.
2. Walk each comment against the pillars, and each uncommented non-obvious decision against Pillar 3. Missing comments are findings too.
3. Run the matching "Don't flag" line before reporting. If it applies, suppress the finding.
4. Rate the smell (see ratings below).
5. Emit a finding with location, the cost, and a before-to-after rewrite. Never propose deleting a comment without saying where its information goes instead, if anywhere.
6. End with a summary count. If nothing survives the guard, say it smells fresh.

## Stink ratings

- **Rancid.** The comment misleads, or its absence hides a trap. Fix now. (A comment that contradicts the code, a doc comment lying about what a function throws, a ghost reference to code that no longer exists, an empty catch with no reason, an unstated ordering dependency or concurrency invariant, a workaround nobody can safely remove because its cause is unnamed.)
- **Funky.** Real drag, not yet a lie. Should fix. (Diff narration, a comment restating the line under it, a magic timeout with no rationale, an unowned TODO, rationale duplicated across four call sites, a comment that wants to be a function name.)
- **Whiff.** Minor or stylistic. Optional. (Banner ceremony, an essay where two sentences do, hedging, emoji.)

## Don't flag (the guard that keeps this useful)

The catalog carries a per-smell exception line. These cut across all of them.

- **The comparative test.** "X rather than Y" is good writing when Y is the alternative a reader would reach for on their own ("average rather than sum, so a three-word query stays comparable to a one-word one"). It is change narration only when Y is what the file used to say. Ask whether a reader who never saw the old code would recognize Y. If yes, leave it alone.
- History that is still load-bearing is not change narration. "This works around a bug in the upstream parser, fixed in v3 but we pin v2" is a standing fact about the world, not a diff note.
- A regression comment that names the failure it prevents is provenance, not a changelog. It becomes a smell only when it says what was changed instead of what breaks without it.
- License headers, generated-file banners, editor directives, `eslint-disable` with a reason, and codegen markers are machinery, not prose. Leave them.
- Respect the ecosystem's doc convention and the project's existing one over the catalog default. A codebase with rustdoc examples on every public item is not over-commenting.
- One finding per real problem. Prefer the smallest rewrite that removes the smell, and prefer deleting a bad comment to expanding it.
- Do not demand a comment on genuinely obvious code. Pillar 3 fires on non-obvious decisions, not on coverage.
- Defer prose register to `no-slop` and the wider "this was hard to understand" repair to `breadcrumbs` rather than duplicating them. The split with `no-slop` is substance versus sound: that skill decides whether a sentence reads as generated (em dashes, slop vocabulary, marketing voice), this one decides whether the comment should exist, what it should say, and where the information belongs. Its `references/code-comments.md` is the one-page register pass over the same surface.

## Output format

```
Comment Stinky report, <scope>

src/features/shell/components/CommandPalette.tsx
  [Rancid] ghost-reference (change narration), line 489
    Smell: the rationale ends "the old fixed Actions-then-Concepts order buried
      the thing most queries are looking for." No such order exists in the tree.
    Cost: the reader cannot check the claim or find what it refers to, so the
      whole comment reads as unverifiable and gets ignored.
    Rewrite: "Groups are ordered by their own best match, so typing 'agent'
      leads with the Agent Panel concept rather than with whichever action was
      declared first." The reason survives; the history goes to git.

  [Funky] restates-the-code (redundancy), line 311
    Smell: "// No animation; just redraw the new position" above a bare draw call.
    Cost: one more line to keep true, and it says nothing the call does not.
    Rewrite: delete. If the absence of animation is deliberate, say why
      ("dragging skips the tween so the node tracks the cursor exactly").

Summary: 1 rancid, 1 funky across 1 file.
```

When the scope is clean, say so plainly: "Smells fresh. No comment smells found in `<scope>`."

## Source

The positive taxonomy adapts Salvatore Sanfilippo's comment classification and Ousterhout's *A Philosophy of Software Design* chapters on comments; the routing table draws on Chris Beams on commit messages and Fowler on code as documentation. The change-narration pillar is grounded in a survey of agent-written comments in the okf-viewer codebase. Each catalog entry carries its own link.
