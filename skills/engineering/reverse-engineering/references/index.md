---
okf_version: "0.2"
---

# Reverse engineering reference bundle

Use these concepts one phase at a time while driving a reverse engineering goal to proven completion. The procedure lives in the skill's SKILL.md; each concept holds the detail for one phase.

- [Goal and input](goal.md) - Pin the target, write the reverse engineering goal as a falsifiable acceptance, choose the oracle and the integration strategy, and set the legal line before any study begins.
- [Research harness](harness.md) - Build controllable, deterministic, agent-operable execution of the original before studying it, so every later observation can be replayed and diffed.
- [Locate data and logic](locate.md) - Techniques for finding where a value, table, or routine lives in an opaque target, ordered cheapest first, with the confidence tier each placement earns.
- [The knowledge ledger](ledger.md) - Record every location and claim once, with how it was found and how to re-verify it, give it a name that code uses, and let lint and generators keep code, docs, and symbol files in step.
- [Implement against the target](implement.md) - Choose the least invasive integration rung, patch only an in-memory copy inside declared and claimed regions, hook at named points, transplant code by generated recipes, and keep output reproducible and saves versioned.
- [Differential testing against the original](differential.md) - Prove an implementation matches the original by running both from one state and input, aligned on the target's own clock, with every allowed difference written down, verdicts that cannot pass by accident, mutation checks of the comparator, and a triage path for each failure.
- [Pitfalls that cost iterations](pitfalls.md) - Reverse engineering failure modes observed in a shipped project, each with the symptom that gives it away and the guard that prevents it.
- [Cyberworld Endless, the loop end to end](worked-example.md) - How one shipped project ran every phase of the loop on a GBA ROM, from pinning the target to transplanting another game's code proven by 366 differential specs and 167 caught mutations.
