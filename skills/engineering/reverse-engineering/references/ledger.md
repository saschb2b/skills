---
type: Convention
title: The knowledge ledger
description: Record every location and claim once, with how it was found and how to re-verify it, give it a name that code uses, and let lint and generators keep code, docs, and symbol files in step.
tags: [reverse-engineering, documentation, symbols, lint]
generated: { by: claude-code/unversioned, at: 2026-10-17T12:00:00Z }
sources:
  - id: cwe-romdata
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/ROM_DATA.md
    title: "Cyberworld Endless, docs/ROM_DATA.md"
  - id: cwe-symbols
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/SYMBOLS.md
    title: "Cyberworld Endless, docs/SYMBOLS.md"
  - id: cwe-agents
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/AGENTS.md
    title: "Cyberworld Endless, AGENTS.md (lint baselines and rules)"
  - id: cwe-fidelity
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/FIDELITY.md
    title: "Cyberworld Endless, docs/FIDELITY.md"
---

# Use the project's ledger

Find the project's existing ledger (a ROM data document, a protocol notes file, a symbols header) and extend it. Create one only when none exists, as a table in the repository's docs. Knowledge kept in a chat transcript or a scratch file is lost at the next session.

# Write one row per location

| Data | Address or offset | How it was found, how to verify it |
| --- | --- | --- |
| Chip names | `0x6E88D0`, `0x6E92D8` | Text archives found by encoding "Cannon" with the game's character table; pointers in code reference both. |

That row is from Cyberworld Endless's ROM data document, which pins the ROM's SHA-1 at its top.[^cwe-romdata] A useful row also carries the [tier](./locate.md) it was placed with and the code that reads it. The verify step is something another person can repeat: a command, a record to list, an observation in the harness. "Looks right" is not a verify step.

# Mark every claim

- **Verified**: name the evidence (the routine, the struct field, the text, the experiment).
- **Assumed**: say so in the row, and say what would verify it.
- **Negative** ("the target has no X"): name the search that came up empty (the names, structures, and pages looked for).
- **Corrected**: state what was wrong and how it was found wrong; never rewrite the row silently.

# Name, never number, in code

Give every address and field one symbolic name in one header, with a one-line description, and use only the name elsewhere: `BN6_PLAYER_X`, not `BN6_PLAYER + 0x1C`. Gate it in lint, which Cyberworld Endless runs in CI:[^cwe-agents]

- A bare offset outside the names header fails.
- An offset with no ledger row fails.
- A name with no description fails.
- Generated symbol files that differ from what the generator writes fail.
- Baselines of existing findings only shrink; after fixing one, update the baseline.

Generate debugger symbol files, JSON, and CSV from the header and the ledger, so the published map never drifts from what the code uses.[^cwe-symbols]

# Keep third-party knowledge clean

A disassembly with no license gives no right to redistribute its names. Credit it, cite a function name where a claim rests on it, and keep the full name map in an ignored build directory, generated on each machine from the user's own checkout. Commit only your own names, your tools, and counts.

# Track fidelity per element

For each user-visible element, record whether it is **original** (the target's own code and data running), **generated** (your engine in the target's formats), or **adapted** (yours, where the target has nothing). Record each decision to mend one of the original's own bugs with its reproduction on the pristine target.[^cwe-fidelity] This is where [pitfalls](./pitfalls.md) like "fixed a bug the original has" are prevented.
