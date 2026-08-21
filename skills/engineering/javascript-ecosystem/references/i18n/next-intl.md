---
type: Library Notes
title: "next-intl"
description: "next-intl is App Router native with strict typing."
tags: [javascript, i18n]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# next-intl

**Verified 2026-08-20.** Check the installed `next-intl` version first; re-verify if newer than below.

**Current stable**: 4.x (4.13.7), compatible with Next.js 16. **LLM default bias**: v2 to v3. Pages Router patterns, `NextIntlProvider`, and pre-`getRequestConfig` setups that predate the App Router and server-component model.

## The shift
next-intl is App Router native with strict typing. v4 centralizes type registration under one `AppConfig` interface (typed `Locale`, typed messages), is ESM-only, and adds ahead-of-time message precompilation. On Next.js 16.3+, `next/root-params` reads the `[locale]` segment directly in Server Components, so static rendering no longer needs the `setRequestLocale` boilerplate.

## Stop / Start
| Stop (next-intl v2 to v3) | Start (next-intl v4) |
| --- | --- |
| Pages Router `NextIntlProvider` + `_app.js` | App Router `[locale]` segment + `NextIntlClientProvider` in the root layout |
| A single `useTranslations` everywhere | `useTranslations()` in Client Components, async `getTranslations()` in Server Components |
| `setRequestLocale(locale)` in every layout and page | `rootParams.locale()` from `next/root-params` in `i18n/request.ts` (Next.js 16.3+), plus `generateStaticParams` for locales |
| Scattered global type declarations | One `AppConfig` augmentation; `hasLocale()` to narrow strings |
| Hand-rolled locale routing | `defineRouting` in `routing.ts` via `createNextIntlPlugin()` |

## Gotchas
- v4 raised floors: TypeScript 5+, ESM-only output.
- The locale cookie is now session-only and set only when a user switches away from the `accept-language` match.
- `getRequestConfig()` must return a `locale`. Its `requestLocale` param is deprecated as of 4.13.6; resolve the locale from `next/root-params` instead.
- `setRequestLocale` is deprecated as of 4.13.5. Keep it only on Next.js below 16.3, where `next/root-params` is unavailable.

## Companion
Next.js paradigm notes in [../meta-frameworks/nextjs.md](../meta-frameworks/nextjs.md).

## Sources
- https://next-intl.dev/blog/next-intl-4-0
- https://next-intl.dev/blog/nextjs-root-params
- https://next-intl.dev/docs/getting-started/app-router
