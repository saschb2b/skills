---
type: Runbook
title: Research harness
description: Build controllable, deterministic, agent-operable execution of the original before studying it, so every later observation can be replayed and diffed.
tags: [reverse-engineering, harness, determinism, emulation]
generated: { by: claude-code/unversioned, at: 2026-10-17T12:00:00Z }
sources:
  - id: cwe-agents
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/AGENTS.md
    title: "Cyberworld Endless, AGENTS.md (romlab, headless shot, play.py, device runs)"
  - id: cwe-devtools
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/DEVTOOLS.md
    title: "Cyberworld Endless, docs/DEVTOOLS.md (dev steps, the differential's boot states and parallel runs)"
  - id: tools-recalled
    resource: "scope:author knowledge of gdb, lldb, rr, Frida, DynamoRIO, QEMU, Unicorn, mitmproxy, Wireshark"
---

# Build it first

Study through an instrument, not by playing the target by hand. Before locating anything, the harness must do all of these from one command:

- [ ] Run headless and faster than real time.
- [ ] Drive input from a script keyed to frames, ticks, or messages.
- [ ] Fix every source of randomness and time (seed the RNG, freeze the clock).
- [ ] Snapshot and restore the whole state.
- [ ] Peek and poke memory, and break or log on reads and writes.
- [ ] Record a trace (memory deltas per frame or per call) and capture outputs (frames, audio, packets, files).
- [ ] Replay a whole session from its seed, start state, and input history.
- [ ] Report the state in words beside each captured picture, so an agent can drive it without seeing the screen.

Cyberworld Endless had two.[^cwe-agents] `romlab` runs the plain ROM in libmgba for research, with scripted input, peeks, pokes, states, and recordings. The game's own headless mode adds `--input`, `--shot`, and dev steps (`place`, `flags`, `foes`, `status`), and `play.py` keeps one session per name with its seed and every command in a history file.

# Pick the harness for the target kind

| Target | Run it | Instrument it |
| --- | --- | --- |
| Console ROM | Emulator core linked as a library | Hooks via a breakpoint instruction, memory access through the core, save states |
| Native binary | The binary under a debugger or record and replay (gdb, lldb, rr) | Dynamic instrumentation (Frida, DynamoRIO), preload shims |
| Firmware | Full-system or CPU emulation (QEMU, Unicorn) | Emulator hooks; JTAG on hardware when emulation lies |
| Network protocol | A recording proxy (mitmproxy) and a replay server | Packet capture (Wireshark), scripted clients |
| File or save format | The original application, headless where possible | A corpus generator and the original as the acceptance judge |
| Undocumented API | Recorded sessions replayed as fixtures | Field-level diff of responses; respect rate limits and terms |

# Prove determinism before trusting a diff

Run the same spec twice and diff the traces. Any difference is a harness bug or a nondeterministic region to document: wall clock, time-seeded RNG, threads, uninitialized memory, interrupt timing, and dead stack below the stack pointer between frames all show up here. Fix the source when you can; otherwise the region becomes a written mask in the [differential](./differential.md), with its reason.

# Run two instances side by side

For content moved between versions or games, run the original as a second instance in the same process. Give each instance its own hook table, memory, and state, and test that a hook on one never fires on the other. In Cyberworld Endless the second core, BN5's, became the differential's reference alone once every battle ran in BN6's engine.[^cwe-devtools]

# Keep it fast and safe

- Run specs in parallel, each in its own process, sharing boot states read-only. The first run writes missing states alone. Verdicts must not depend on the parallelism level.
- Mount the artifact read-only from outside the repository. Never write the player's or user's file.
- On a physical device, use a throwaway data directory and compare save hashes before and after.
