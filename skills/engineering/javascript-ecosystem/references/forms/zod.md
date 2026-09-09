---
type: Library Notes
title: "Zod"
description: "Zod 4 is a near-total internal rewrite (much faster parsing, smaller core, far fewer type instantiations); 4.5 and 4.6 added `z.compile()`, `z.validate()`, and a standalone `@zod/mini` package."
tags: [javascript, forms]
generated: { by: claude-code/unversioned, at: 2026-09-09T00:00:00Z }
---
# Zod

**Verified 2026-09-09.** Check the installed `zod` version first; re-verify if newer than below.

**Current stable**: 4.6 (Sep 9, 2026; 4.5 Aug 28, 2026); Zod 4.0 stable shipped May 2025. **LLM default bias**: Zod 3.x. `z.string().email()`, single-arg `z.record()`, and the `message`/`invalid_type_error`/`required_error`/`errorMap` error API.

## The shift
Zod 4 is a near-total internal rewrite (much faster parsing, smaller core, far fewer type instantiations). It promotes string-format validators to tree-shakable top-level functions, unifies all error customization under one `error` param, and adds a `zod/mini` functional variant. 4.5 added a compile step (`z.compile()`) that generates optimized parsers and a boolean-only `z.validate()` fast path; 4.6 publishes Zod Mini as its own `@zod/mini` package. Zod is used well beyond forms (API boundaries, env, config), so this matters broadly.

## Stop / Start
| Stop (Zod 3) | Start (Zod 4) |
| --- | --- |
| `z.string().email()` / `.url()` / `.uuid()` | Top-level `z.email()`, `z.url()`, `z.uuid()` (plus `z.creditCard()`, `z.iban()` since 4.5 and 4.6) |
| `z.string({ message, invalid_type_error, required_error })` and `errorMap` | A single unified `z.string({ error })` (string or function) |
| `z.record(z.string())` (single arg) | `z.record(z.string(), z.string())` (key and value) |
| `.default()` applying to the input type | `.default()` now applies to output; use `.prefault()` for the old behavior |
| `error.format()` / `error.flatten()` | `z.treeifyError(error)` |
| `schema.safeParse(x).success` only to gate a hot path | `z.validate(schema, x)` for a boolean answer; `z.compile(schema)` for repeated parses |

## Gotchas
- Issue type names changed (e.g. `ZodInvalidTypeIssue` to `z.core.$ZodIssueInvalidType`); custom error-introspection code breaks.
- `z.uuid()` is now strict per RFC; strings that passed loose v3 checks may fail.
- `zod@3.25` ships v4 internally under the `zod/v4` subpath, so a minor v3 bump can pull v4 code paths. Pin deliberately.
- Bundle-size-critical code can import `zod/mini` from the main package or the standalone `@zod/mini` package (4.6); pick one per project so two copies do not ship.
- `z.compile()` generates an optimized parser from the schema at runtime; `z.withParser()` (4.6) attaches an externally generated parser instead, for build-time codegen setups.
- `z.deepPartial()` / `.exactPartial()` (4.5) are the recursive partial helpers; Zod 3's `.deepPartial()` method had been removed in 4.0.

## Sources
- https://zod.dev/v4
- https://zod.dev/v4/changelog
- https://github.com/colinhacks/zod/releases
