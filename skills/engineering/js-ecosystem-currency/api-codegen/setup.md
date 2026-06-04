# API codegen setup (full teachable reference)

Self-contained setup for the api-codegen tools, so this skill teaches the whole workflow without any other skill installed. The standalone **codegen-api** skill is an optional deeper dive on the same material.

## Hey API (REST to TanStack Query)

```ts
// openapi-ts.config.ts
import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./openapi.yaml",
  output: "src/client",
  plugins: ["@hey-api/typescript", "@hey-api/sdk", "@tanstack/react-query"],
});
```

Add `"codegen:api": "openapi-ts"` to `package.json`, then use the options factory with TanStack's own hook:

```tsx
const { data } = useQuery({
  ...getPetByIdOptions({ path: { petId } }),
  staleTime: 5000,
});
```

Add the `zod` plugin to the array for runtime validation at the boundary.

## graphql-codegen client preset (Apollo / urql)

```ts
// codegen.ts
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://api.example.com/graphql",
  documents: ["src/**/*.{ts,tsx}"],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
      config: { enumsAsTypes: true },
      presetConfig: { fragmentMasking: true },
    },
  },
};
export default config;
```

For TanStack Query plus a custom fetch wrapper, add `config.documentMode: "string"` so the codegen emits `TypedDocumentString`.

> CRITICAL. `documentMode: "string"` paired with Apollo or urql types all results as `any`. Those clients want the AST default. Only use `"string"` with TanStack Query and a custom fetch wrapper. (Apollo also recommends `typescript-operations` + `typed-document-node` over this preset; see `graphql-codegen.md`.)

## gql.tada (zero-codegen, no build step)

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

## Fragment masking (component composition)

Each component declares its own data via a fragment. The prop type is `FragmentType<typeof XFragment>`, which is opaque: a parent cannot read fields it did not request. Only the owner unwraps with `useFragment()`.

```tsx
// Leaf
import { graphql, FragmentType, useFragment } from "../gql";

export const FilmCardFragment = graphql(`
  fragment FilmCard on Film { title releaseDate director }
`);

function FilmCard(props: { film: FragmentType<typeof FilmCardFragment> }) {
  const film = useFragment(FilmCardFragment, props.film);
  return <article><h3>{film.title}</h3><p>{film.director}</p></article>;
}
```

```tsx
// Mid-level
export const FilmListFragment = graphql(`
  fragment FilmList on FilmsConnection { totalCount films { id ...FilmCard } }
`);

function FilmList(props: { data: FragmentType<typeof FilmListFragment> }) {
  const conn = useFragment(FilmListFragment, props.data);
  return <ul>{conn.films?.map((f) => <li key={f?.id}><FilmCard film={f} /></li>)}</ul>;
}
```

```tsx
// Top-level
const AllFilmsQuery = graphql(`query AllFilms { allFilms { ...FilmList } }`);

function FilmsPage() {
  const { data, loading } = useQuery(AllFilmsQuery);
  if (loading) return <p>Loading...</p>;
  if (!data?.allFilms) return <p>No films</p>;
  return <FilmList data={data.allFilms} />;
}
```

| Layer | Fragment | Owns | Spreads |
| --- | --- | --- | --- |
| Page | `AllFilmsQuery` | nothing | `...FilmList` |
| List | `FilmListFragment` | `id`, `totalCount` | `...FilmCard` |
| Card | `FilmCardFragment` | `title`, `releaseDate`, `director` | nothing |

`FilmsPage` literally cannot read `film.title`; TypeScript enforces the boundary. Adding a field to `FilmCardFragment` updates only that component. In gql.tada the pattern is identical with `readFragment()` in place of `useFragment()`. Skip fragments for a single flat page that fetches and renders directly.

## DX pitfalls

- **Stale ESLint types during `--watch`.** Codegen regeneration makes ESLint's TS program go stale, producing false `no-unsafe-*` errors. Switch ESLint to `parserOptions.projectService: true` (shares the editor language service) and turn off `@typescript-eslint/no-unsafe-{member-access,assignment,return,argument}`.
- **`graphql()` autocomplete.** The popular `graphql.vscode-graphql` extension does not autocomplete inside `graphql()` calls. Use the Apollo GraphQL extension (`apollographql.vscode-apollo`) with an `apollo.config.js` whose `tagName` is `graphql`; it works for any codegen setup.

## Avoid

`@graphql-codegen/typescript-react-apollo`, `@graphql-codegen/typescript-react-query`, and `openapi-typescript-codegen` hook generators. Deprecated or community-stale.

## Source

From [Typesafe API Code Generation for React in 2026](https://saschb2b.com/blog/typesafe-api-codegen-2026). The standalone **codegen-api** skill covers the same material if installed.
