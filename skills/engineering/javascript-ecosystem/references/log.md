## 2026-08-21

* **Update**: Cleared the last 28 orphan concepts by adding a `Companion` section to each, naming the relationship in prose (alternatives, incumbents, and layer neighbours). The bundle now passes the strict producer gate with 0 orphans and 0 broken links. Only navigation changed, so each file's `Verified` stamp stays at 2026-08-20 while its `timestamp` moves to the edit date.

## 2026-08-20

* **Update**: Full re-verification pass over all 90 concepts against official release notes and migration guides. Every note's `Verified` stamp and `timestamp` moved to 2026-08-20.
* **Update**: New majors recorded. TypeScript 7 (Go compiler, now stable), Vite 8 (Rolldown shipped), ESLint 10 (v9 end of life), npm 12 (`npm shrinkwrap` removed), Nx 23, React Router 8, Pinia 4, Nodemailer 9, Sanity Studio 6, Vercel AI SDK 7, OpenAI SDK 7, Motion 13, Prisma 7.9, Clerk Core 3.
* **Update**: Paradigm moves recorded. shadcn/ui defaults to Base UI rather than Radix, next-intl replaced `setRequestLocale` with `next/root-params`, Playwright component testing became first-party, `@angular/aria` reached stable, and tRPC gained first-party OpenAPI generation (alpha).
* **Update**: Corrected claims that had gone wrong since the last snapshot. `eslint-plugin-react-hooks` is v7 (not v6), SolidStart v2 shipped stable on Solid 1.x, Vitest 4.0 GA was October 2025, Resend batch send accepts `tags` and `scheduled_at`, tRPC is no longer OpenAPI-incapable, urql core is on 6.x, and the retired `vercel-labs/next-skills` was removed from the first-party guidance.
* **Update**: Flagged prerelease majors that agents must not write against yet. TanStack Query 6, Jotai 3, NgRx 22, Fastify 6, Prisma 8, pnpm 12, Vitest 5, and Payload 4.
* **Update**: Marked `openapi-fetch` and `openapi-react-query` as maintenance-only for 2026 per their maintainers.
* **Creation**: Added this log to the bundle.
