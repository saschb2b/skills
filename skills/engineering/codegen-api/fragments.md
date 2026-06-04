# Fragment Masking

Fragment masking solves a problem that comes up the moment a GraphQL component tree has more than one layer: how do you type the data flowing to a child component without generating a new type for every query shape?

## The old approach (do not use)

Legacy graphql-codegen plugins generated a type per query result:

```ts
type AllFilmsQuery = { allFilms: { films: AllFilmsQuery_allFilms_films[] } };
type AllFilmsQuery_allFilms_films = { title: string; releaseDate: string };
```

Every slightly different query produced its own near-duplicate types. Every query change cascaded type updates across components. Some teams tried wrapping fetches in custom hooks (`useFilmCard`, `useFilmList`) to encapsulate the typing, but that just traded type explosion for hook explosion.

## The 2026 approach

Each component declares the data it needs via a fragment. The prop type is `FragmentType<typeof XFragment>`, which is opaque: the parent cannot accidentally access fields it did not request. Only the owning component can unwrap it.

> The unwrap function is named `useFragment()` by default, but despite the `use` prefix it is NOT a React hook and does not follow the rules of hooks. Set `presetConfig.fragmentMasking.unmaskFunctionName: "getFragmentData"` in `codegen.ts` to rename it and avoid ESLint rules-of-hooks false positives. The examples below use `getFragmentData()`.

### Leaf component

```tsx
import { graphql, FragmentType, getFragmentData } from "../gql";

export const FilmCardFragment = graphql(`
  fragment FilmCard on Film {
    title
    releaseDate
    director
  }
`);

function FilmCard(props: { film: FragmentType<typeof FilmCardFragment> }) {
  const film = getFragmentData(FilmCardFragment, props.film);
  return (
    <div>
      <h3>{film.title}</h3>
      <p>Directed by {film.director}</p>
      <time>{film.releaseDate}</time>
    </div>
  );
}
```

### Mid-level component

```tsx
export const FilmListFragment = graphql(`
  fragment FilmList on FilmsConnection {
    totalCount
    films {
      id
      ...FilmCard
    }
  }
`);

function FilmList(props: { data: FragmentType<typeof FilmListFragment> }) {
  const connection = getFragmentData(FilmListFragment, props.data);
  return (
    <section>
      <h2>{connection.totalCount} films</h2>
      <ul>
        {connection.films?.map((film) => (
          <li key={film?.id}><FilmCard film={film} /></li>
        ))}
      </ul>
    </section>
  );
}
```

`FilmList` can read `id` and `totalCount` (which it declared) but cannot read `director` or `releaseDate` (those belong to `FilmCard`). TypeScript enforces the boundary.

### Top-level component

```tsx
const AllFilmsQuery = graphql(`
  query AllFilms {
    allFilms { ...FilmList }
  }
`);

function FilmsPage() {
  const { data, loading } = useQuery(AllFilmsQuery);
  if (loading) return <p>Loading…</p>;
  if (!data?.allFilms) return <p>No films found</p>;
  return <FilmList data={data.allFilms} />;
}
```

`FilmsPage` cannot read any film fields at all. The data is fully opaque. It just passes the bag down.

## Ownership table

| Layer | Fragment | Owns | Spreads |
| --- | --- | --- | --- |
| Page | `AllFilmsQuery` | nothing | `...FilmList` |
| List | `FilmListFragment` | `id`, `totalCount` | `...FilmCard` |
| Card | `FilmCardFragment` | `title`, `releaseDate`, `director` | nothing |

## Why this matters

- **No manual types anywhere.** Every prop is `FragmentType<typeof XFragment>`. No per-query result types, no `Pick<>` gymnastics, no type explosion.
- **Safe refactoring.** Add a `rating` field to `FilmCardFragment`, re-run codegen, the query automatically requests it. No parent component changes.
- **Compile-time boundary enforcement.** `FilmsPage` literally cannot access `film.title`. TypeScript rejects it.
- **No hook wrappers.** The fragment is the type contract. Passing typed data to a child has no logic to encapsulate.

## When to skip fragments

A single page that fetches data and renders it directly, no child components involved: the inferred type from `useQuery` is fine. Do not add fragments to a flat component.

## In gql.tada

Same pattern, different helper. Use `readFragment()` in place of `getFragmentData()`.

## Source

From the fragment masking section of [Typesafe API Code Generation for React in 2026](https://saschb2b.com/blog/typesafe-api-codegen-2026).
