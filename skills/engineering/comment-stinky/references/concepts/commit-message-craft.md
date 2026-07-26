---
type: Concept
title: "Commit Message Craft"
description: "The destination for everything the write gate strips out of a comment, what belongs in the subject and the body, and why the commit is a better home for change narration than the source file."
tags: [git, commits, documentation, comments]
generated: { by: claude-code/unversioned, at: 2026-07-26T00:00:00Z }
sources:
  - resource: https://cbea.ms/git-commit/
    title: "Beams, How to Write a Git Commit Message"
  - resource: https://google.github.io/eng-practices/review/developer/cl-descriptions.html
    title: "Google Engineering Practices, Writing good CL descriptions"
  - resource: https://git-scm.com/docs/git-commit#_discussion
    title: "Git documentation, git-commit discussion"
---
# Commit Message Craft

Almost everything the [write gate](../write-gate.md) removes from a comment belongs here. This is not a consolation prize. The commit message is a strictly better home for change narration on every axis that matters.

## Why the commit wins for change information

- **It describes a moment, so it cannot go stale.** A comment claims something about the code as it is, and every later edit is a chance to falsify it. A commit message claims something about one transition, and that transition is frozen forever. This is the same property from the other side of [comment-decay.md](./comment-decay.md).
- **It is attached to the change, not to a line.** `git blame` and `git log -L` route from any line to the message that explains its history, so the information is reachable from exactly where a reader would want it, without occupying space there.
- **It carries the whole change.** A comment sees one file. A commit sees the set of files that moved together, which is usually what the reason is actually about.
- **Its audience is right.** A commit message is read by someone investigating a change. That is precisely the reader change narration was written for.

## What goes where

`Subject`
: One line, imperative mood, under about 50 characters, no trailing period. What this commit does to the tree. "Wrap the stage checkbox in its label", not "Wrapped" and not "Fixes".

`Body`
: The reason, and only the reason. What was wrong, why the obvious alternative was rejected, what the reader should know if they are considering reverting it. Wrapped at about 72 characters, separated from the subject by a blank line.

`Trailers`
: Machine-readable references. Issue links, co-authors, review IDs.

The body is where "this used to be a bare 16px checkbox, which is under the touch-target floor" lives comfortably and correctly. In a comment it is a ghost reference; in a commit body it is an accurate account of a real prior state.

## The division of labor with comments

Write both, from the same understanding, aimed at different readers:

| Fact | Comment | Commit |
| --- | --- | --- |
| The label is the hit area, because 16px is under the 24px floor | Yes | Yes, in the body |
| The checkbox used to be bare | No, it is a ghost reference | Yes, this is the change |
| A bare checkbox fails the touch-target guideline | Yes, this is the standing force | Yes |
| Which files moved and in what order | No | Yes |
| Which review comment prompted it | No | Trailer, if the project uses them |

A useful working order: write the comment first, at its most natural and most diff-shaped, then apply the gate and move every clause it strikes into the commit body. Nothing is lost, both artifacts end up correct, and the sorting takes seconds because the material is already in hand.

## The failure this prevents

When a project has weak commit messages ("fix", "update", "wip"), the pressure to narrate changes in comments becomes real, because there is nowhere else for that information to go. The comment smell and the commit smell are the same shortage seen twice. Fixing the second is what makes the first fixable, which is why [information-routing.md](./information-routing.md) treats them as one decision rather than two rules.
