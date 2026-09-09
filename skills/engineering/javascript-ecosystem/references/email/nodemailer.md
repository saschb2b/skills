---
type: Library Notes
title: "Nodemailer"
description: "Nodemailer is still the canonical lower-level SMTP and transport library; the role is unchanged, but majors 7 through 10 broke on the edges, and v10 is a TypeScript rewrite with ESM and CJS builds."
tags: [javascript, email]
generated: { by: claude-code/unversioned, at: 2026-09-09T00:00:00Z }
---
# Nodemailer

**Verified 2026-09-09.** Check the installed `nodemailer` version first; re-verify if newer than below.

**Current stable**: 10.0 (v10.0.0 Sep 3, 2026; 10.0.1 Sep 7). v9 (Jun 2026) and v8 (Feb 2026) preceded it inside the same year. **LLM default bias**: Nodemailer 6.x. `createTransport({ service: "gmail", auth: { user, pass } })`, the old SES v2/v3 SDK transport, the error code `'NoAuth'`, and installing `@types/nodemailer` for types.

## The shift
Nodemailer is still the canonical lower-level SMTP and transport library; the role is unchanged, but majors 7 through 10 broke on the edges. v7 moved AWS SES to the SESv2 SDK and removed the older SES transports and rate-limiting helpers. v8 renamed the auth error code `'NoAuth'` to `'ENOAUTH'` and hardened TLS, DNS, and stream handling. v9 turned on TLS certificate validation by default when fetching remote content into a message. v10 migrated the codebase to TypeScript with native ESM and CommonJS builds and bundled type declarations, and requires Node 20 or newer.

## Stop / Start
| Stop (Nodemailer 6) | Start (Nodemailer 10) |
| --- | --- |
| `nodemailer@^6` in `package.json` | `nodemailer@^10` on Node 20+ |
| Installing `@types/nodemailer` alongside | Types ship in the package (the old `@types/nodemailer` layout still resolves) |
| Remote images or attachments pulled over self-signed or expired TLS | Valid certificates, or an explicit per-request `tls.rejectUnauthorized: false` |
| Catching `err.code === 'NoAuth'` | Catching `err.code === 'ENOAUTH'` |
| The legacy SES v2/v3 SDK transport | The SESv2-based SES transport (or an API provider) |
| Relying on Nodemailer's built-in SES rate-limiting | Handle throttling yourself or at the provider (removed in v7) |
| Hand-writing raw HTML strings inline | Render with React Email (`await render(<Email/>)`) and pass as the `html` field |

## Gotchas
- v10 drops Node 18 and earlier; the Node 6 syntax-compatibility check and `.npmignore` are gone. Both `import nodemailer from 'nodemailer'` and `require('nodemailer')` work.
- The `'NoAuth'` to `'ENOAUTH'` rename in v8 silently breaks error-handling switch statements; grep for it.
- v9 validates TLS certificates on remote fetches, so internal hosts with self-signed or expired certs that used to work now fail; fix the cert or opt out per request.
- v10 also tightened URL parsing for connection and proxy strings (hosts the legacy parser would truncate are refused; a colon in the user name is kept) and merges the other keys of a config object next to its `url`.
- If you used Nodemailer's SES integration, the v7 SESv2 migration requires code changes.
- Nodemailer sends but does not template; pair it with React Email's awaited `render()` output.

## Companion
Author templates with [react-email.md](./react-email.md).

## Sources
- https://github.com/nodemailer/nodemailer/blob/master/CHANGELOG.md
- https://www.npmjs.com/package/nodemailer
