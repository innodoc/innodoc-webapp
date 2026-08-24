# Repo tooling

Three tools enforce monorepo hygiene, each with a different focus.

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
