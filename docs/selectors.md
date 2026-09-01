# Selectors

Where memoized selectors live and what the store hooks call.

## Placement

- **Selectors are defined at module scope in `packages/shared-store/src/slices/**`\*\*, next to the
  entity they read. Module scope means one instance per process and one shared cache.
- **`packages/ui-shared/src/store-hooks/*` files call selectors** (plain functions or RTK Query's
  `select()`) - they do not define them.
- **Never call `createSelector(` inside a `use*` hook or component.** A selector built in a render
  body starts from an empty cache on every render, so it memoizes nothing while the component still
  pays for the full work. Wrapping it in `useMemo(..., [])` only fragments the cache per component
  instance: two consumers of the same state get distinct objects, and the referential stability that
  `React.memo` children and RTK Query's `shallowEqual` gate rely on is broken.

  `packages/ui-shared/src/store-hooks/store-hooks-placement.test.ts` enforces the floor of this
  rule: `createSelector(` must not appear inside a hook or component body. While the in-flight
  section-selector fixes land in parallel, it carries a pending file list that can only shrink -
  remove an entry as its fix lands on `dev`.

## Memoization policy

- **Memoize only when it pays.** A selector that builds fresh objects/arrays or does real work
  (filtering, translating, tree building) gets a `createSelector`. A pure lookup (reading a state
  field, indexing a precomputed map) stays a plain `selectX` function - wrapping it is ceremony.
  `selectPageLinks` in `ui-design-system` is the lookup example: it precomputes its four
  (slot × course-context) results as module constants and its body is a lookup.
- **The "no data" sentinel is a frozen module-level constant**, never an inline `[]`/`{}`: an inline
  constant inside the selector body is a fresh reference on every run and defeats the output equality
  check.
- **Naming: `selectX`.**
- **Stability is a testable property, not a style preference.** Hooks that feed `React.memo` children
  or `selectFromResult` must keep their result reference across re-renders for unchanged input -
  see `section-selector-stability.test.tsx` next to the hooks.

## Gotchas

- **Moving the section selectors into `shared-store` requires moving `translateEntity` /
  `translateEntityArray` into `@innodoc/shared-core` first** - `shared-store` must not import from
  `ui-*` (depcruise enforces the boundary).
- **The React Compiler is not in the build** (no `babel-plugin-react-compiler` in `viteReact()`), so
  memoization is manual and the `react/react-compiler` lint rule is intentionally off (see
  `.oxlintrc.json`). The `oxlint-disable react/react-compiler` comments in the store hooks document
  the spots where a future compiler pass would bail out and where manual memoization is the contract.
