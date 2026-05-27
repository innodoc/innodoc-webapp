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

Analyzes the module dependency graph across `packages/` to detect forbidden patterns: circular dependencies, orphaned files, deprecated Node.js core modules, deps not declared in package.json, test files imported by non-test code, and dev-only deps used in production packages.

| Script                    | Description                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| `pnpm depcruise:validate` | Validate the dependency graph against rules (used in CI)                                    |
| `pnpm depcruise`          | Generate full + high-level SVG graphs and a violations HTML report, then serve them locally |

## knip

**Focus:** Unused code & dependencies.

Detects unused dependencies, devDependencies, binaries, exports, and files across all workspaces. Helps keep the repo lean by flagging packages declared in `package.json` but never imported, and files that are never referenced.

| Script      | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| `pnpm knip` | Run knip and report unused dependencies, exports, and files |
