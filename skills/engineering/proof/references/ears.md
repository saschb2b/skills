---
type: Method
title: EARS requirements
description: Write observable acceptance requirements with the EARS patterns and derive checks from behavior.
resource: https://alistairmavin.com/ears/
tags: [requirements, ears, testing]
timestamp: 2026-09-16T00:42:23Z
---

# Choose the condition

EARS constrains natural-language requirements with a small set of ordered clauses. It is lightweight specification syntax, not a proof system or a test runner. The five basic patterns can be combined. [1]

| Pattern | Illustrative requirement authored for this skill | Check design |
| --- | --- | --- |
| Ubiquitous | The editor shall preserve the saved title when reopened. | Persist, reopen, and observe the title |
| Event | When the user saves a valid title, the editor shall display the saved title. | Arrange input, trigger save, observe result |
| State | While a save is pending, the editor shall prevent a second submission. | Hold the request pending and attempt another submission |
| Unwanted behavior | If saving fails, then the editor shall preserve the entered title and show a failure alert. | Force the failure and inspect both outcomes |
| Optional feature | Where team editing is enabled, the editor shall show the editor's team name. | Exercise the relevant configuration |

For combined conditions, place state before trigger: while offline, when the user saves, the editor shall retain the draft locally. `IF ... THEN` is one unwanted-behavior pattern, not two separate test types. `WHERE` describes feature applicability rather than a generic runtime condition. [1]

# Derive a useful check

The mapping from requirement to tests is a design task. An event may have multiple meaningful boundaries, actor roles, or configurations. A single invariant may need checks over several transitions. Neither keyword counting nor one test per sentence establishes coverage.

For a maximum of 80 characters agreed in the story, check the meaningful boundary and failure behavior rather than arbitrarily generating every input length. Decide how length is measured before freezing if Unicode or composed characters affect the requirement. Put that product decision in the [contract](./acceptance-contract.md), not in a hidden test assumption.

Avoid implementation-shaped criteria unless the implementation is itself a real constraint. A customer usually needs a saved title to survive reopening; they do not require that a particular hook invoke a particular setter. A storage encryption or dependency constraint may legitimately require a lower-layer check.

# Common mistakes

- Treating every keyword as a standalone test loses the condition-response relationship.
- Choosing exact text or a timing threshold without authority creates a new product requirement.
- Testing only the happy path misses a specified failure or pending state.
- Proving a mocked dependency returns the configured value does not prove the application's required behavior.

Use [verification](./verification.md) to judge whether the implemented checks actually observe each criterion.

# Citations

[1] [Alistair Mavin's official EARS guide](https://alistairmavin.com/ears/), consulted 2026-09-16, supplies the pattern meanings and clause order. Examples, testing advice, and boundary analysis above are this skill's authored applications. See [source decisions](./sources.md) for claims intentionally not adopted.
