---
type: Runbook
title: Research harness
description: Build controllable, deterministic, agent-operable execution of the original before studying it, with or without save states, so every later observation can be replayed and diffed.
tags: [reverse-engineering, harness, determinism, emulation]
generated: { by: claude-code/unversioned, at: 2026-10-17T15:00:00Z }
sources:
  - id: cwe-agents
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/AGENTS.md
    title: "Cyberworld Endless, AGENTS.md (romlab, headless shot, play.py, device runs)"
  - id: cwe-devtools
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/DEVTOOLS.md
    title: "Cyberworld Endless, docs/DEVTOOLS.md (dev steps, the differential's boot states and parallel runs)"
  - id: tools-recalled
    resource: "scope:author knowledge of rr and WinDbg Time Travel Debugging, and of determinism tactics for native targets"
---

# Build it first

Study through an instrument, not by playing the target by hand. Before locating anything, the harness must do all of these from one command:

- [ ] Run unattended and, where the target allows, headless and faster than real time.
- [ ] Drive input from a script keyed to frames, ticks, or messages (injected input on a native target).
- [ ] Fix every source of randomness and time (seed the RNG, freeze the clock).
- [ ] Snapshot and restore the whole state.
- [ ] Peek and poke memory, and break or log on reads and writes.
- [ ] Record a trace (memory deltas per frame or per call) and capture outputs (frames, audio, packets, files).
- [ ] Replay a whole session from its seed, start state, and input history.
- [ ] Report the state in words beside each captured picture, so an agent can drive it without seeing the screen.

Cyberworld Endless had two.[^cwe-agents] `romlab` runs the plain ROM in libmgba for research, with scripted input, peeks, pokes, states, and recordings. The game's own headless mode adds `--input`, `--shot`, and dev steps (`place`, `flags`, `foes`, `status`), and `play.py` keeps one session per name with its seed and every command in a history file.

# Pick the instruments for the target class

[Target profiles](./targets.md) lists, per class, what runs the target controllably, what hooks it, and what its own clock is. An emulator gives most of the checklist for free. A native PC, mobile, or managed target needs it assembled, and the hardest item is usually the snapshot.

# Get determinism without save states

When the target has no save states (a native process, a device, a server):

- **Record and replay** the whole process where the platform allows it (rr on Linux, Time Travel Debugging in WinDbg), and study the recording instead of live runs.
- **Use the target's own persistence**: its save files, a replay or demo system, a debug or benchmark mode that runs a fixed scene.
- **Hook the nondeterminism**: the RNG seed, the clock and timer reads, frame pacing (force a fixed timestep), and network or file input, all driven from your script.
- **Restart instead of restore**: launch from the same pinned build, config, save, and seed, and drive identical input from frame or tick zero.

Whatever the method, the exit test is the same: two runs from one start and one script trace identically.

# Prove determinism before trusting a diff

Run the same spec twice and diff the traces. Any difference is a harness bug or a nondeterministic region to document: wall clock, time-seeded RNG, thread scheduling, uninitialized memory, interrupt timing, and dead stack below the stack pointer between steps all show up here. Fix the source when you can; otherwise the region becomes a written mask in the [differential](./differential.md), with its reason.

# Run two instances side by side

For content moved between versions or games, run the original as a second instance in the same process. Give each instance its own hook table, memory, and state, and test that a hook on one never fires on the other. In Cyberworld Endless the second core, BN5's, became the differential's reference alone once every battle ran in BN6's engine.[^cwe-devtools]

# Keep it fast and safe

- Run specs in parallel, each in its own process, sharing boot states read-only. The first run writes missing states alone. Verdicts must not depend on the parallelism level.
- Mount the artifact read-only from outside the repository. Never write the user's file or install.
- On a physical device, use a throwaway data directory and compare save hashes before and after.
