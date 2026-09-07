# Repo tooling

Three tools enforce monorepo hygiene, each with a different focus.

Cutting a release is documented in `docs/releasing.md`.

## syncpack

**Focus:** `package.json` consistency & formatting.

Ensures dependency versions are aligned across workspaces, keys are sorted, and formatting conventions are respected. Also enforces custom rules via `versionGroups` (e.g., internal packages must use `workspace:*`, external deps must use `catalog:`, `@types/*` banned from prod deps).

| Script                    | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| `pnpm syncpack`           | Run both format check and lint                                 |
| `pnpm syncpack lint`      | Lint version consistency across workspace package.json files   |
| `pnpm syncpack:fmt:check` | Check package.json formatting (sorted keys, indentation, etc.) |

## dependency-cruiser

**Focus:** Import graph & dependency boundaries.

Analyzes the module dependency graph across `apps/` and `packages/` to detect forbidden patterns: circular dependencies, orphaned files, deprecated Node.js core modules, deps not declared in package.json, test files imported by non-test code, and dev-only deps used in production packages.

Config traps: `exclude` and `includeOnly` also apply to _resolved dependency paths_, not just crawl roots - matching `node_modules` in `exclude` (or restricting with `includeOnly`) silently strips every npm and node-core edge, and whole rule categories become unable to fire. `doNotFollow: node_modules` must stay: without it the crawl walks the pnpm store and OOMs. See the comments in `.dependency-cruiser.cjs`.

| Script                    | Description                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| `pnpm depcruise:validate` | Validate the dependency graph against rules (used in CI)                                    |
| `pnpm depcruise`          | Generate full + high-level SVG graphs and a violations HTML report, then serve them locally |

## knip

**Focus:** Unused code & dependencies.

Detects unused dependencies, devDependencies, binaries, exports, and files across all workspaces. Unlike depcruise, it also tracks type-only imports. It flags packages declared in `package.json` but never imported, and files that are never referenced.

Notes: it only reads `jsPlugins` (not `extends`) from `.oxlintrc.json`, so a config package consumed via `extends` must be listed in `ignoreDependencies`; re-export-style `vitest.config.ts` files are not auto-detected, so packages with tests declare an explicit `vitest.entry` in `knip.json`. Knip is not part of `pnpm dev:checks` - run it manually.

| Script      | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| `pnpm knip` | Run knip and report unused dependencies, exports, and files |

## TypeScript

**Focus:** Type-checking, builds & editor support.

The repo runs TypeScript 7 (the native Go port) for all `tsc` invocations (`typecheck`, `build`). Since TS 7 ships no JS compiler API, the catalog maps the `typescript` package to the 6.x compatibility package (`npm:@typescript/typescript6`) for tooling that imports the API at runtime (e.g. the eslint chain loaded by oxlint), while `@typescript/native` (`npm:typescript@^7`) provides the native `tsc` binary used by every workspace package. The legacy JS compiler is still available as `tsc6`.

| Binary                  | Compiler          | Used by                                   |
| ----------------------- | ----------------- | ----------------------------------------- |
| `tsc`                   | TS 7 (native)     | All `typecheck`/`build` scripts           |
| `tsc6`                  | TS 6 (JavaScript) | Fallback / manual comparison              |
| `require('typescript')` | TS 6 (JavaScript) | Tooling needing the compiler API (eslint) |

When a TS-API-consuming tool (typescript-eslint, @eslint-react, ...) adds TS 7 support, remove the `typescript` alias from the catalog and the `@typescript/native` entries, then restore a plain `typescript: ^7` catalog entry.
