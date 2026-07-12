---
type: Worked Example Set
title: Worked healing examples
description: End-to-end examples of turning understanding friction into small durable codebase repairs.
tags: [maintainability, examples, agent-workflow]
timestamp: 2026-07-12T20:50:00Z
---

# Read the contrast

Each example begins with a real [knowledge smell](/smells.md). The weak response records what the agent learned. The healing response changes how the next person encounters the same area, using [repair patterns](/repairs.md) within the [scope rails](/scope-rails.md).

# Hidden transaction contract

**Trace:** `saveOrder(order)` fails only in production. Reading every caller reveals that it must execute inside an existing transaction.

**Weak response:** Add "call inside a transaction" to an agent notes file.

**Healing response:** Require a transaction-scoped dependency in the function signature, validate the context at the boundary when the language cannot encode it, and add one invalid-context contract test. Keep a docstring only if the type still leaves a meaningful usage choice unexplained.

**Why it heals:** Invalid usage becomes harder or impossible, and failure points at the contract instead of a downstream database error.

# Browser compatibility workaround

**Trace:** A redundant-looking DOM read prevents a Safari rendering defect. Removing it passes unit tests but breaks the supported browser.

**Weak response:** Rewrite the code for elegance or leave a comment saying "needed for Safari."

**Healing response:** Keep the workaround, add a concise comment naming the observed constraint and consequence, link a stable upstream issue when available, and add the narrowest browser regression coverage the project supports.

**Why it heals:** The next maintainer knows why normal simplification is unsafe and has evidence that will reveal when the workaround is no longer needed.

# Misplaced checkout configuration

**Trace:** Checkout retry timing is configured under `analytics`, so several searches and modules lead away from the owner.

**Weak response:** Document the surprising path in `breadcrumbs.md`.

**Healing response:** If compatibility permits, move and rename the setting under checkout ownership. Otherwise expose a canonical checkout-facing configuration entry point that delegates to the legacy location, state precedence once, and cover resolution behavior with a focused test.

**Why it heals:** Future readers follow the expected information scent. They do not need to know the historical surprise.

# Generated-source trap

**Trace:** The obvious file contains the incorrect value, but a build step regenerates it from a schema.

**Weak response:** Patch the generated file or add a note telling agents not to edit it.

**Healing response:** Fix the schema or generator, ensure generated output identifies its source when repository conventions allow, and update the existing contributor command if regeneration is non-obvious. Verify by regenerating and checking for a clean diff.

**Why it heals:** The fix survives, and the ownership path is visible at the point where a future developer is likely to look.

# Opaque validation error

**Trace:** Startup reports `invalid configuration`; debugging reveals a required `region` field is empty after environment interpolation.

**Weak response:** Add the discovery to setup notes while keeping the same error.

**Healing response:** Validate `region` immediately after interpolation and report the field, expected condition, and relevant configuration source without printing secrets. Correct existing setup documentation if it claimed the field was optional.

**Why it heals:** The system teaches the requirement at failure time, while the documentation remains consistent for proactive readers.

# Repair too large for the task

**Trace:** A small bug exposes two competing configuration systems across public packages. Consolidation would require migration and compatibility work.

**Weak response:** Quietly start the migration, or create a permanent breadcrumb registry entry.

**Healing response:** Complete the bug fix without entrenching a third source of truth. In the task handoff, state the failed expectation, evidence for the competing owners, likely consolidation direction, and why public compatibility puts it outside the current scope.

**Why it heals responsibly:** The observation remains actionable without disguising a broad architecture change as incidental cleanup.
