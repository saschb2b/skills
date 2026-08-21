---
type: Library Notes
title: "OpenTelemetry JS"
description: "SDK 2.0 dropped Node 14/16 (now `^18.19.0 || >=20.6.0`), raised TypeScript to 5.0.4+, retargeted ES2022, and removed classes and namespaces for tree-shaking, while keeping `@opentelemetry/api`..."
tags: [javascript, observability]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# OpenTelemetry JS

**Verified 2026-08-20.** Check the installed `@opentelemetry/*` SDK versions first; re-verify if newer than below.

**Current stable**: SDK 2.x (stable packages at 2.10, experimental at 0.221, Jul 2026). The `@opentelemetry/api` package stays on 1.x by design (1.9). **LLM default bias**: SDK 1.x packages, Node 14/16 setups, and class/namespace-heavy configuration with manual `NodeTracerProvider` wiring.

## The shift
SDK 2.0 dropped Node 14/16 (now `^18.19.0 || >=20.6.0`), raised TypeScript to 5.0.4+, retargeted ES2022, and removed classes and namespaces for tree-shaking, while keeping `@opentelemetry/api` stable so instrumentation code is unaffected. Traces and metrics are stable; logs are a separate, pre-stable Logs Bridge API.

## Stop / Start
| Stop (SDK 1.x habits) | Start (SDK 2.x) |
| --- | --- |
| Installing on Node 14/16 | Node `^18.19.0 || >=20.6.0` |
| Hand-wiring every instrumentation | `getNodeAutoInstrumentations()` from `auto-instrumentations-node` |
| `new NodeTracerProvider()` + manual processor/exporter boilerplate | `NodeSDK({ traceExporter, metricReader, instrumentations }).start()` |
| Treating metrics as experimental | Metrics are stable; use `PeriodicExportingMetricReader` |
| Expecting a stable logs API in `@opentelemetry/api` | The separate `@opentelemetry/api-logs` (alpha) |
| Class/namespace imports | The functional exports per the 2.x upgrade guide |

## Gotchas
- `@opentelemetry/api` stays on 1.x; there is no "2.0" API package. Pin SDK packages (>=2.0.0) and experimental packages (>=0.200.0) consistently.
- Logs are still pre-stable in JS (status "development") and will fold into the core API once stabilized.
- SDK 3.x is planned for roughly Sep 2026 and drops the deprecated `propagator-jaeger`, `shim-opentracing`, and `shim-opencensus` packages. Migrate off them before upgrading.
- Load `sdk.start()` before importing instrumented libraries (preload via `--require`/`--import`).

## Companion
Errors and frontend performance via [sentry.md](./sentry.md).

## Sources
- https://opentelemetry.io/blog/2025/otel-js-sdk-2-0/
- https://opentelemetry.io/docs/languages/js/
- https://github.com/open-telemetry/opentelemetry-js/releases
