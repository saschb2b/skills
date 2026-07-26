---
type: Reference
title: "DX Pitfalls in Codegen Workflows"
description: "Two sharp edges that surface in any real graphql-codegen project."
tags: [openapi, graphql, codegen, typescript]
generated: { by: claude-code/unversioned, at: 2026-05-12T00:00:00Z }
---
# DX Pitfalls in Codegen Workflows

Two sharp edges that surface in any real graphql-codegen project.

## Stale ESLint types during watch mode

Running `graphql-codegen --watch` regenerates types constantly. ESLint's TypeScript program caches type information and goes stale after each regeneration, producing false-positive errors in any file using `useQuery` or `useMutation`. The types are actually correct. The lint program is out of date.

Two-part fix. Switch ESLint to `projectService` so it shares the editor's TypeScript language service rather than maintaining its own program. Then disable the `no-unsafe-*` rules, which exist to catch `any` slipping in but only produce noise once codegen gives you proper types.

```js
// eslint.config.mjs
parserOptions: {
  projectService: true,
  tsconfigRootDir: import.meta.dirname,
},
rules: {
  "@typescript-eslint/no-unsafe-member-access": "off",
  "@typescript-eslint/no-unsafe-assignment": "off",
  "@typescript-eslint/no-unsafe-return": "off",
  "@typescript-eslint/no-unsafe-argument": "off",
}
```

All other type-aware rules (`await-thenable`, etc.) continue to work normally.

## VS Code autocomplete inside `graphql()` calls

The popular `graphql.vscode-graphql` extension does not provide autocomplete inside `graphql()` template literal calls. Use the **Apollo GraphQL extension** (`apollographql.vscode-apollo`) instead. It works for any codegen setup, not just Apollo Client.

```js
// apollo.config.js at the project root
module.exports = {
  client: {
    tagName: "graphql",
    service: {
      name: "my-app",
      localSchemaFile: "./api/schema.graphql",
    },
    includes: ["./src/**/*.{ts,tsx,js,jsx}"],
  },
};
```

`tagName` must match the codegen-generated function name (`graphql` for both graphql-codegen client preset and gql.tada). The extension then gives schema-aware autocomplete, validation, and go-to-definition inside every `graphql()` call.

## Source

From [Typesafe API Code Generation for React in 2026](https://saschb2b.com/blog/typesafe-api-codegen-2026).
