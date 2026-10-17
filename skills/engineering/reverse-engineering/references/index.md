---
okf_version: "0.2"
---

# Reverse engineering reference bundle

Use these concepts one phase at a time while driving a reverse engineering goal to proven completion, on any target class. The procedure lives in the skill's SKILL.md; each concept holds the detail for one phase.

- [Goal and input](goal.md) - Pin the target, write the reverse engineering goal as a falsifiable acceptance, choose the oracle and the integration strategy, and set the legal line before any study begins.
- [Target profiles](targets.md) - How each class of target (cartridge and disc consoles, installed PC games, managed and engine builds, mobile apps, firmware, file formats, protocols) is run, hooked, clocked, extended, kept stable across loads, and given an oracle, so the loop applies unchanged to any of them.
- [Research harness](harness.md) - Build controllable, deterministic, agent-operable execution of the original before studying it, with or without save states, sandboxed against what the target contains, and set up so the agent's context stays small and several agents can share the work.
- [Locate data and logic](locate.md) - Techniques for finding where a value, table, or routine lives in an opaque target of any class, ordered cheapest first from leftover metadata to cross-version matching, with the confidence tier each placement earns.
- [The knowledge ledger](ledger.md) - Record every location and claim once, with how it was found, how to re-verify it, and its state (verified, derived, assumed, refuted, open), give it a name that code uses, take every number from a tool, and let lint and generators keep code, docs, symbol files, and the analysis database in step.
- [Implement against the target](implement.md) - Choose the least invasive integration rung, patch only what is loaded inside declared and claimed regions, hook at named points with the mechanism the target class offers, transplant or replace code one routine at a time, and keep output reproducible and saves versioned.
- [Differential testing against the original](differential.md) - Prove an implementation matches the original by running both from one state and input, aligned on the target's own clock, with every allowed difference written down, an oracle the builder cannot edit, verdicts that cannot pass by accident, mutation checks of the comparator, ratcheted attempts, and a triage path for each failure.
- [Pitfalls that cost iterations](pitfalls.md) - Reverse engineering failure modes, from a shipped project, from other target classes, and from agent-driven work, each with the symptom that gives it away and the guard that prevents it.
- [Cyberworld Endless, the loop end to end](worked-example.md) - How one shipped project ran every phase of the loop on a GBA ROM, from pinning the target to transplanting another game's code proven by 366 differential specs and 167 caught mutations.
