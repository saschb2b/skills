---
type: Convention
title: The knowledge ledger
description: Record every location and claim once, with how it was found, how to re-verify it, and its state (verified, derived, assumed, refuted, open), give it a name that code uses, take every number from a tool, and let lint and generators keep code, docs, symbol files, and the analysis database in step.
tags: [reverse-engineering, documentation, symbols, lint]
generated: { by: claude-code/unversioned, at: 2026-10-17T17:00:00Z }
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
  - id: reverify
    resource: https://github.com/2akouwu/reverify
    title: "Reverify v0.9.0 README (verdicts, depends_on invalidation, refutations kept as KNOWN FALSE, ledger keyed by the binary's sha256), read 2026-10-17"
  - id: rea
    resource: https://github.com/morluto/rea
    title: "REA, .agents/skills/reverse-engineer-anything/SKILL.md (observations, inferences, and unknowns kept apart), read 2026-10-17"
  - id: ida-pro-mcp
    resource: https://github.com/mrexodia/ida-pro-mcp
    title: "ida-pro-mcp README (never convert number bases yourself; use the int_convert tool), read 2026-10-17"
  - id: binary-re
    resource: https://github.com/2389-research/binary-re
    title: "binary-re, docs/skill-learnings-2026-01-06.md (empty cross-references from too shallow an auto-analysis), read 2026-10-17"
  - id: tob-audit
    resource: https://github.com/trailofbits/skills/tree/main/plugins/audit-context-building
    title: "Trail of Bits audit-context-building, resources/DOMAIN_NOTES.md (function boundaries are themselves a finding), read 2026-10-17"
  - id: reva
    resource: https://github.com/cyberkaida/reverse-engineering-assistant
    title: "ReVa skills, deep-analysis (rename and retype, then decompile again to confirm the improvement), read 2026-10-17"
---

# Use the project's ledger

Find the project's existing ledger (a ROM data document, a protocol notes file, a symbols header) and extend it. Create one only when none exists, as a table in the repository's docs. Knowledge kept in a chat transcript or a scratch file is lost at the next session.

# Write one row per location

| Data | Address or offset | How it was found, how to verify it |
| --- | --- | --- |
| Chip names | `0x6E88D0`, `0x6E92D8` | Text archives found by encoding "Cannon" with the game's character table; pointers in code reference both. |

That row is from Cyberworld Endless's ROM data document, which pins the ROM's SHA-1 at its top.[^cwe-romdata] A useful row also carries the [tier](./locate.md) it was placed with and the code that reads it. The verify step is something another person can repeat: a command, a record to list, an observation in the harness. "Looks right" is not a verify step.

# Mark every claim

- **Verified**: name the evidence (the routine, the struct field, the text, the experiment). Static reading is evidence of code, not of execution; say which you have.
- **Derived**: follows from verified rows; list them, so it falls when one does.
- **Assumed**: say so in the row, and say what would verify it.
- **Open**: a question, with what would settle it (an experiment, an environment, an authority) and the evidence for and against so far.
- **Refuted**: keep the row, with what refuted it, so a later session does not propose it again; claims that depended on it fall with it. Reverify stores refutations as known false and invalidates their dependents for exactly this reason.[^reverify]
- **Negative** ("the target has no X"): name the search that came up empty and how complete it was: analysis depth, functions recovered, sources searched. A shallow auto-analysis returns empty cross-references that a deeper one fills,[^binary-re] and recovered function boundaries are themselves a finding to record.[^tob-audit]
- **Corrected**: state what was wrong and how it was found wrong; never rewrite the row silently.

Keep observations, inferences, and unknowns apart in every conclusion you report.[^rea]

# Take every number from a tool

Write no address, offset, size, count, or byte value that a tool did not read or convert in this session. Base conversion, endianness, and offset arithmetic done in your head are where a hook lands one instruction off. The ida-pro-mcp server tells agents never to convert number bases themselves and gives them a tool for it.[^ida-pro-mcp]

# Name, never number, in code

Give every address, signature, and field one symbolic name in one header, with a one-line description, and use only the name elsewhere: `BN6_PLAYER_X`, not `BN6_PLAYER + 0x1C`. On a relocating loader the header holds module-relative offsets or byte signatures, resolved at load. Gate it in lint, which Cyberworld Endless runs in CI:[^cwe-agents]

- A bare offset outside the names header fails.
- An offset with no ledger row fails.
- A name with no description fails.
- Generated symbol files that differ from what the generator writes fail.
- Baselines of existing findings only shrink; after fixing one, update the baseline.

Generate debugger symbol files, JSON, and CSV from the header and the ledger, so the published map never drifts from what the code uses.[^cwe-symbols]

Where a disassembler or decompiler project exists, mirror each row into it as you write the row: the name, the type, a comment with the evidence, and a mark on names that are only assumed. Decompile again after each rename or retype to confirm the output reads better.[^reva] Key the ledger to the build's hash, keep it in files rather than the conversation, and reread it at the start of every session.[^reverify]

# Keep third-party knowledge clean

A disassembly with no license gives no right to redistribute its names. Credit it, cite a function name where a claim rests on it, and keep the full name map in an ignored build directory, generated on each machine from the user's own checkout. Commit only your own names, your tools, and counts.

# Track fidelity per element

For each user-visible element, record whether it is **original** (the target's own code and data running), **generated** (your engine in the target's formats), or **adapted** (yours, where the target has nothing). Record each decision to mend one of the original's own bugs with its reproduction on the pristine target.[^cwe-fidelity] This is where [pitfalls](./pitfalls.md) like "fixed a bug the original has" are prevented.
