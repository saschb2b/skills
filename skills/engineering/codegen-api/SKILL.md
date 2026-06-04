---
name: codegen-api
description: Set up typesafe API code generation in 2026, preferring framework-agnostic options factories over generated hooks. Walks the decision matrix for REST (OpenAPI via hey-api) and GraphQL (graphql-codegen client preset, gql.tada), wires the minimal config for the chosen stack, and uses fragment masking for component composition. Use when starting an API integration, wiring an OpenAPI spec into a frontend, setting up GraphQL types, asked about useQuery, queryOptions, TypedDocumentNode, or fragment masking, or when seeing legacy patterns like generated useGetX hooks, per-query prop types, or @graphql-codegen/typescript-react-apollo. Counterweight to LLM training corpora that mostly reflect the pre-2024 hooks pattern, biasing default output toward generated hooks.
date: 2026-05-12
source_post: typesafe-api-codegen-2026
---

# Typesafe API Codegen

## Rule

**Generate options, not hooks. Generate documents, not per-query types.**

Both ecosystems converged in 2024-2025. REST and GraphQL codegens stopped emitting framework-specific hooks (`useGetPet`, `useFilmsQuery`) and started emitting framework-agnostic primitives that plug into the data-fetching library's existing hooks. Do not reach for legacy codegen plugins that emit hooks or per-query prop types.

This is the most common failure mode in LLM-generated API wiring: the bulk of training corpora reflects the pre-shift hooks pattern, so the default output reaches for `@graphql-codegen/typescript-react-apollo`, `typescript-react-query`, or `openapi-typescript-codegen` hook generators.

## Step 1: Pick the path

| API source | Data fetching | Pick |
| --- | --- | --- |
| OpenAPI / REST | TanStack Query (any framework) | **`@hey-api/openapi-ts`** with `@tanstack/react-query` plugin |
| GraphQL | Apollo Client or urql | **`graphql-codegen` client preset**, default `documentMode` (AST) |
| GraphQL | TanStack Query (custom fetch) | **`graphql-codegen` client preset** with `documentMode: "string"` |
| GraphQL, small schema, no build step | any | **`gql.tada`** (zero-codegen, TS inference) |
| OpenAPI / REST, existing Orval setup | TanStack Query | Stay on Orval until `queryOptions` ships. Do not migrate without cause. |

Avoid: `@graphql-codegen/typescript-react-apollo`, `@graphql-codegen/typescript-react-query`, `openapi-typescript-codegen` hook generators. Deprecated or community-stale.

## Step 2: Wire the config

**Hey API (REST → TanStack Query):**

```ts
// openapi-ts.config.ts
import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./openapi.yaml",
  output: "src/client",
  plugins: ["@hey-api/typescript", "@hey-api/sdk", "@tanstack/react-query"],
});
```

Add to `package.json`: `"codegen:api": "openapi-ts"`.

**graphql-codegen client preset (Apollo / urql):**

```ts
// codegen.ts
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://api.example.com/graphql",
  documents: ["src/**/*.{ts,tsx}", "!src/gql/**/*"],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
      config: { enumsAsTypes: true },
      presetConfig: { fragmentMasking: { unmaskFunctionName: "getFragmentData" } },
    },
  },
};
export default config;
```

**graphql-codegen client preset (TanStack Query):** same as above plus `config.documentMode: "string"` so the codegen emits `TypedDocumentString` for a custom `execute` wrapper.

> CRITICAL. `documentMode: "string"` paired with Apollo or urql makes all query results type as `any`. Those clients want the AST default. Only use `"string"` with TanStack Query plus a custom fetch wrapper.

**gql.tada:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "plugins": [{
      "name": "gql.tada/ts-plugin",
      "schema": "./schema.graphql",
      "tadaOutputLocation": "./src/graphql-env.d.ts"
    }]
  }
}
```

No codegen script. Types update with TypeScript.

## Step 3: Use the generated primitives directly

```tsx
// REST (hey-api)
const { data } = useQuery({
  ...getPetByIdOptions({ path: { petId } }),
  staleTime: 5000,
});

// GraphQL (codegen, Apollo / urql)
const { data } = useQuery(AllFilmsQuery);

// GraphQL (codegen, TanStack)
const { data } = useQuery({
  queryKey: ["allPeople"],
  queryFn: () => execute(PeopleQuery),
});
```

Do not wrap these in custom `useFilmCard` or `useGetPet` hooks. The generated primitive is already the right level of abstraction. Hook wrappers only existed historically to carry types; fragment masking now does that better.

## Step 4: Component composition via fragment masking

If the component tree has more than one layer, do not generate per-query prop types and do not build hook wrappers per component. Use fragment masking: each component declares its own data via a fragment, parents cannot see fields they did not request. Full three-layer example, ownership table, and the gql.tada equivalent (`readFragment`) in [fragments.md](./fragments.md).

For a single page that fetches data and renders it directly with no child components, the inferred `useQuery` type is fine. Do not add fragments to a flat component.

## Step 5: Optional: Zod runtime validation

Both hey-api and graphql-codegen can emit Zod schemas at system boundaries:

```ts
plugins: ["@hey-api/typescript", "@hey-api/sdk", "@tanstack/react-query", "zod"]
```

Useful where the data cannot be trusted (third-party APIs, user uploads).

## Step 6: Fix the editor traps

Codegen watch mode breaks ESLint's TypeScript cache. The popular VS Code GraphQL extension does not autocomplete inside `graphql()`. Fixes in [dx-pitfalls.md](./dx-pitfalls.md).

## Source

Based on [Typesafe API Code Generation for React in 2026](https://saschb2b.com/blog/typesafe-api-codegen-2026). Deeper detail in [fragments.md](./fragments.md) and [dx-pitfalls.md](./dx-pitfalls.md).
