---
type: Worked Example
title: Cyberworld Endless, the loop end to end
description: How one shipped project ran every phase of the loop on a GBA ROM, from pinning the target to transplanting another game's code proven by 366 differential specs and 167 caught mutations.
tags: [reverse-engineering, case-study, emulation, differential-testing]
generated: { by: claude-code/unversioned, at: 2026-10-17T12:00:00Z }
sources:
  - id: cwe-repo
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless
    title: "Cyberworld Endless repository at commit 0fcd1e2 (AGENTS.md, docs/, tools/, tests/xdiff)"
  - id: cwe-romdata
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/ROM_DATA.md
    title: "Cyberworld Endless, docs/ROM_DATA.md"
  - id: cwe-sources
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/SOURCES.md
    title: "Cyberworld Endless, docs/SOURCES.md (Learned from players)"
  - id: cwe-changelog
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/CHANGELOG.md
    title: "Cyberworld Endless, CHANGELOG.md"
---

# The project

Cyberworld Endless is a roguelike that runs Mega Man Battle Network 6 from the player's own ROM on an embedded mGBA core and directs it: generated layers in the game's map formats, the run's structure, loot, and saves. Later it moved Battle Network 5's enemy families, Navis, chips, and Souls into BN6's battle engine by their own code. It ships no Capcom data.[^cwe-repo]

# Phase by phase

| Phase | What the project did |
| --- | --- |
| 0. Input | Pinned BN6 Cybeast Gregar (USA) by SHA-1 at the top of the ROM data document; BN5 got its own layout. Chose to run the original under an emulator and direct it, because no C decompilation exists and a native build would ship Capcom's code. Wrote the legal line: numbers only in git (addresses, IDs, checksums). |
| 1. Harness | `romlab` (libmgba, scripted input, peeks, pokes, states, recordings); the game's headless mode with scripted input, dev steps, and captures; `play.py` sessions replayable from seed and history; a per-frame memory trace; two cores in one process, each with its own hook table, unit-tested on a ROM of the test's own bytes. |
| 2. Locate | Chip records at Falzar's address, confirmed by a sanity value (Cannon = 40 power); chip names by encoding "Cannon" in the game's character table; cross event flags by setting ranges and halving them until the screen appeared; tiles and palettes traced back from VRAM dumps; map tables by structure scan; 98.1% of the disassembly's functions located in Gregar by masked bytes, 31.8% in BN5.[^cwe-romdata] |
| 3. Understand | A player said BN6 keeps DarkChips from a Japan-only feature. The disassembly's chip-use routine and play on the ROM confirmed it, and the experiment found what the claim left out (each paid use also adds an HP bug for the battle). Another player's report of ProtoMan going untouchable was reproduced on the plain ROM: BN6's own bug, then mended by a hook and recorded as such.[^cwe-sources] |
| 4. Output | Replaced per-frame polling and hand-written code patches with breakpoint hooks; seeded runs gave the same logs line for line. New data in a free-space plan, every installer's writes claimed. Transplants as generated recipes: each source block's CRC32, twin routines, immediates checked against their instructions, an all-or-nothing install that reads every word it changes and requires the expected value, and veneers for calls beyond branch reach. The generator was held field for field to the first hand-made recipes. |
| 5. Test | The control first: BN6's own Mettaur, native, installed, and moved, compared every byte over 3,899 frames. Then the differential: each moved family fought in BN5's own engine and in BN6's, aligned on the battle timer, seven specs per family. 325 specs ran in 2 minutes 44 seconds on 16 CPUs with the same verdicts as one at a time. |
| 6. Iterate | The control showed the moved Mettaur's ice block read past BN6's table at the first freeze (frame 342), so that per-ID table was grown too. The differential found a branch split from the instruction it jumps to, and a sprite preload reading 9 bits of an ID where the spawn reads 12. Differences that turned out to be the engines' own became masks citing both games' routines. |

# Where it ended

By release 0.12.0: 366 specs, 363 passing and 3 stopping at their recorded frames, and all 167 deliberate breaks of the moved code caught. Twenty-five BN5 families, BN5's Navis, chips, and Souls run in BN6's engine on every build. Every offset has its row, every symbol its description, and the lint baselines only shrink.[^cwe-changelog]

# What transfers

The game is incidental. The pattern is a pinned target, a harness before any study, a ledger that code reads names from, the least invasive integration, a control before every subject, and an oracle whose masks carry reasons and whose failures are proven by mutation. Each phase links to its concept: [goal](./goal.md), [harness](./harness.md), [locate](./locate.md), [ledger](./ledger.md), [implement](./implement.md), [differential](./differential.md), and the [pitfalls](./pitfalls.md) the project hit on the way.
