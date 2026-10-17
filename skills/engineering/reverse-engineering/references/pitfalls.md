---
type: Failure Catalog
title: Pitfalls that cost iterations
description: Reverse engineering failure modes observed in a shipped project, each with the symptom that gives it away and the guard that prevents it.
tags: [reverse-engineering, pitfalls, debugging, lessons]
generated: { by: claude-code/unversioned, at: 2026-10-17T12:00:00Z }
sources:
  - id: cwe-changelog
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/CHANGELOG.md
    title: "Cyberworld Endless, CHANGELOG.md"
  - id: cwe-lessons
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/.claude/skills/playtest-loop/lessons.md
    title: "Cyberworld Endless, playtest-loop lessons.md (one loop change per session)"
  - id: cwe-symbols
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/SYMBOLS.md
    title: "Cyberworld Endless, docs/SYMBOLS.md"
---

# Check this list when a loop stalls

Each row happened in Cyberworld Endless and cost at least one iteration.[^cwe-changelog][^cwe-lessons][^cwe-symbols] Read the symptom column first; the guard is what the [loop](./differential.md) should already have done.

| Pitfall | Symptom | Guard |
| --- | --- | --- |
| Asserting from memory | A fix built on someone's statement of the original's rule is wrong | Verify by experiment first; a note claims only what was checked ([ledger](./ledger.md)) |
| Trusting third-party labels | A disassembly comment gives offset `0x12`, the code reads `0x10` | Compute offsets from types; verify each before use |
| Single-reference placement | A function of another body placed where a twin sits | Require corroboration; grade the tier ([locate](./locate.md)) |
| Assuming a sibling encodes alike | Text from a sister game read with the host's character table ("M-Cannon" as "MCannon") | Give each version its own layout and tables; check glyph for glyph |
| Guessed sentinels and units | A "no song" value of `0xFF` stops nothing; a power stored as 1000 plus a tenth | Find the value the original itself writes; never guess a sentinel |
| Off-by-one IDs | "Unnamed entry 17" was entry 18 | Confirm an ID by observing the target use it |
| Reading before the target writes | A battle's record was read before the game wrote it, so a stale value drove the logic | Hook the write, or read after the routine that fills it |
| Seeding at the wrong moment | Every seed plays the same, or the two sides part after the opening | Seed both at the first aligned frame; check two seeds differ |
| The observer changes state | Opening a status screen drew one of the run's random numbers | Observers read only; test that observing leaves the trace identical |
| Silent engine limits | Past sixteen objects per map the rest vanish without an error | Find the target's caps and enforce them on your side |
| Polling and hand-written patches | Per-frame memory scans and hand-written code caves to learn what happened | Replace with hooks at named points; prove with golden logs |
| Colliding patches | Two installers write the same bytes; each check passes alone | A claim registry over all writes ([implement](./implement.md)) |
| Bare offsets in code | A field moves and three call sites disagree | Names in one header; lint bans bare offsets |
| Testing the wrong build | A check on a stale build reads as "the fix does not work" | Pin the build per session; print its identity in every report |
| Fixing the instance, not the class | A trigger bug came back four times, once per side tested | Test the class: eight compass offsets at two distances |
| Chance-dependent reproduction | Three random hands never held the suspect case | Write a deterministic probe that forces it |
| A detector with no negative control | A price "verified" from stale bytes printed every battle | Run without the event and require silence |
| Masking to go green | The diff passes and the bug ships | Every mask cites both routines; mutations prove the diff still fails |
| Blaming yourself for the original | Time spent fixing behavior the original has | Reproduce on the pristine target, then keep or mend it in writing |

# Turn every stall into a loop change

After each session, append one line to the project's lessons log: what went wrong and the one change to the loop that prevents it. A manual step done twice becomes a script; a misread seen twice becomes a rule in the harness or the spec.
