---
type: Policy Guide
title: Shared Definition of Done
description: Apply stable project quality obligations without copying a constitution into every story.
tags: [scrum, policy, definition-of-done]
timestamp: 2026-09-16T00:42:23Z
---

# Reuse the team's policy

Read the existing Definition of Done, repository rules, and accepted quality constraints before creating new policy. Scrum's Definition of Done describes the quality state required of an Increment; Developers must conform to it. Story-specific acceptance criteria complement that commitment. [1]

Reference the actual policy files and pin their exact contents when freezing the [contract](./acceptance-contract.md). A hash establishes which policy was considered; it does not enforce the policy. Give each applicable obligation an explicit check in the contract, or trace it to an existing mandatory check whose evidence the verifier will examine.

# Decide applicability

| Existing policy example | Application to a title-editing story |
| --- | --- |
| New interactive controls work by keyboard | Include a keyboard interaction check if the story adds or changes a control |
| Dependency changes require a stated rationale | Inspect manifests and lockfile changes; record whether the condition applies |
| Persistence changes preserve tenant separation | Exercise another tenant if the story changes the data access path |
| Required static checks pass | Run the established command, inspect its result, and link evidence |

These are illustrative policies, not rules installed by this skill. Do not invent a ban on dependencies or require a new Storybook story for every change without authority.

Decide conditional applicability before freezing. Record why an obligation does not apply, rather than creating a criterion and later dropping it from the verdict. If the implementation unexpectedly changes applicability, revise the contract and rerun verification. The gate requires the complete set of frozen criteria; it has no invisible exemption path.

# Grow deliberately

Capture a repeated failure and the smallest general rule that would have prevented it. Review it through the team's normal process, which may be a retrospective or an ordinary policy change. No mandatory sprint-only edit schedule is imposed.

Version the policy and record why it changed. New story revisions pin the current version. Existing frozen stories do not silently inherit changed rules: decide whether to rebaseline them and invalidate their evidence, or preserve their historical policy basis. Keep past policy content available in version history.

Avoid duplicating large policy texts inside every story. Reference one concept in the knowledge bundle and capture relevant obligations in each contract's check mapping. The [OKF placement](./okf-profile.md) explains the links, and the [lifecycle](./lifecycle.md) explains revision ownership.

# Citations

[1] [The Scrum Guide, Definition of Done](https://scrumguides.org/scrum-guide.html#commitment-definition-of-done), consulted 2026-09-16. Policy pinning and applicability handling are this skill's local design; see [sources](./sources.md).
