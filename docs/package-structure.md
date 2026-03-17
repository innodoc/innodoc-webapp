# New package structure

```
apps
  backend: container, logging
  frontend
  e2e

packages
  content-parser: markdown

  server-db: database
  server-env: config

  shared-core: constants, types, typeguards, constants, i18n, routes, schemas
  shared-fixtures: mock-content

  ui-design-system: common components, theme
  ui-content: markdown rendering, exercises, etc.
  ui-features: business logic UI (app shell, pages, user login, settings, etc.), contexts, usePageContext, useRouteManager
  ui-store: redux store + store hooks
  ui-test-utils: rtl

tooling
  configs (eslint,tsconfig,vitest,vite-env,prettier)
  commands (icon-bundle, import-v1, print-routes)
```

## Enforce boundaries

Strict dependency flow (prevents circular deps):

```
           apps
            │
 ┌──────┬───┴────┬────────┐
 │      ▼        ▼        │
 │   server     ui        │
 │   (Node)   (React)     │
 │      │        │        │
 │      │        │        ▼
 │      ├────────┼───► content
 │      │        │        │
 │      ▼        ▼        │
 └─────►  shared  ◄───────┘
```

- `apps/*`
  - → ✅ (everything)
- `packages/shared-*`
  - → ❌ (nothing)
- `packages/content-*`
  - → `shared`
- `packages/server-*`
  - → `shared`, `content`
  - Node-only
- `packages/ui-*`
  - → `shared`, `content`
  - React-only

Enforce using ESLint plugin: https://www.jsboundaries.dev/

### Never

```
❌ shared → ui, content, server
❌ content → ui, server
❌ ui → server
```
