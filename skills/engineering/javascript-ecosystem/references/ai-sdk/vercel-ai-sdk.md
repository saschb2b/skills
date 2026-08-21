---
type: Library Notes
title: "Vercel AI SDK (`ai`)"
description: "v5 split messages into `UIMessage` (UI state, an ordered `parts` array) versus `ModelMessage` (LLM input). v7 made the SDK an agent platform and dropped the `experimental_` prefixes."
tags: [javascript, ai-sdk]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# Vercel AI SDK (`ai`)

**Verified 2026-08-20.** Check the installed `ai` and `@ai-sdk/*` provider versions first; re-verify if newer than below.

**Current stable**: 7.0 (v7 shipped Jun 2026; v6 Dec 2025; v5 Jul 2025). **LLM default bias**: v3/v4 patterns. A single `Message` type with `message.content` strings, tools defined with `parameters`, `maxTokens`, `maxSteps`, `useChat` managing input internally, and providers imported as classes. Newer models still reach for v5/v6 spellings like `system` and `experimental_` prefixes.

## The shift
v5 split messages into `UIMessage` (UI state, an ordered `parts` array) versus `ModelMessage` (LLM input), moved to native SSE streaming, and renamed the tool surface. v6 added the agent model (`Agent`, `ToolLoopAgent`) and stable MCP. v7 turned that into a production agent platform (tool approvals, durable `WorkflowAgent`, unified telemetry, `HarnessAgent`) and graduated the `experimental_` prefixes.

## Stop / Start
| Stop (v3 through v6) | Start (v7) |
| --- | --- |
| `tool({ parameters: z.object(...) })` | `tool({ inputSchema: z.object(...) })` (and `outputSchema`) |
| `generateText({ maxSteps: 5 })` | `generateText({ stopWhen: isStepCount(5) })` (`stepCountIs` was renamed) |
| `system: '...'` | `instructions: '...'` (system messages inside `messages` are rejected by default) |
| Reading `message.content` | Iterating the typed `message.parts` array |
| `maxTokens` | `maxOutputTokens` |
| `CoreMessage` / `Message` types | `ModelMessage` (to the model) and `UIMessage` (to the UI) |
| `useChat` with built-in input state + `api` | A `transport` (`DefaultChatTransport`), managing input yourself |
| `experimental_` prefixes (`experimental_output`, `experimental_telemetry`) | The bare names (`output`, `telemetry`, `generateImage`, `transcribe`) |
| `onFinish` / `onStepFinish` | `onEnd` / `onStepEnd` |
| `streamText(...).fullStream` | `.stream` |
| Hand-rolling agent loops or retry/resume logic | `ToolLoopAgent`, or `WorkflowAgent` for durable resumable runs |

## Gotchas
- Run the official codemod: `npx @ai-sdk/codemod v7`. v6 to v7 is mostly renames; v4 to v5 is still the heavy migration.
- v7 requires Node.js 22 and is ESM-only. CommonJS support was removed, so a `require()` codebase cannot upgrade without moving to ESM.
- OpenTelemetry moved out of core into `@ai-sdk/otel`, which you register separately. Once registered, telemetry is opt-out rather than opt-in.
- Provider packages are version-skewed from core: with `ai` v7 use `@ai-sdk/openai` v4, `@ai-sdk/anthropic` v4, and `@ai-sdk/react` v4. They export factory functions, not classes. Do not pin them to `ai`'s major.
- `ToolLoopAgent` defaults to a bounded step count; set `stopWhen` explicitly to control loop length and cost.

## Companion
Direct provider access in [anthropic-sdk.md](./anthropic-sdk.md) and [openai-sdk.md](./openai-sdk.md).

## Agent skills
The AI SDK ships official agent skills (`npx skills add vercel/ai`) and coding-agent docs (ai-sdk.dev/docs/getting-started/coding-agents). Prefer them. For the upgrade there is a dedicated skill: `npx skills add vercel/ai --skill migrate-ai-sdk-v6-to-v7`.

## Sources
- https://vercel.com/blog/ai-sdk-7
- https://ai-sdk.dev/docs/migration-guides/migration-guide-7-0
