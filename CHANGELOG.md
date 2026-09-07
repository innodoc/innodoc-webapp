# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0-alpha.0](https://github.com/innodoc/innodoc-webapp/compare/v1.0.3...v2.0.0-alpha.0) (2026-09-07)

First alpha of the 2.x rewrite. The content pipeline, the course/content API and the
development workflow are in place, but 2.x is **not stable** and **not a drop-in
replacement for 1.x**: user accounts, answers, progress and the 1.x question validators
are not implemented yet (see [Known gaps vs 1.x](#known-gaps-vs-1x)).

### Highlights

- **MongoDB → PostgreSQL via Knex.** Content storage moved to PostgreSQL, accessed
  through Knex (`@innodoc/server-db`) with migrations for the locale, courses, pages,
  fragments and sections tables.
- **Next.js / Vike → Fastify with Vite SSR and a custom streaming React renderer.** The
  server is a Fastify app that embeds Vite (HMR-aware dev server) and renders pages with
  a custom streaming SSR entry (`renderToPipeableStream` + unhead) in dev and production.
- **JavaScript → strict TypeScript, built with native TypeScript 7.** The whole monorepo
  is strict TypeScript (`strict: true`, no `any`); builds and typechecks run on the
  native TS 7 compiler (`@typescript/native`).
- **Material-UI v9.** The UI is built on `@mui/material` 9.x, including MUI X Tree View
  for the table of contents.
- **pnpm workspaces + Turbo.** pnpm workspace with a shared dependency catalog and Turbo
  for task orchestration across `apps/*` and `packages/*`.
- **Redux state in `@innodoc/shared-store`.** Redux Toolkit store with separate client
  and SSR factories, populated during SSR via direct database calls.
- **i18next-based localization.** Per-locale content with a "not yet translated" state
  for declared locales without content, canonical per-page URLs with `x-default`
  hreflang, and language-menu labels that fall back to the ISO 639-1 name.
- **View Transitions API page transitions.** Client-side navigations are animated with
  `document.startViewTransition` by the route navigator.
- **Playwright e2e matrix over both course-slug modes.** CI runs the e2e suite once per
  `INNODOC_PUBLIC_COURSE_SLUG_MODE` (`SINGLE` and `URL`).
- **Guardrail tooling.** oxlint + oxfmt, syncpack (dependency and version consistency),
  dependency-cruiser package-boundary rules, and knip (unused code and dependencies).
- **Conventional commits + release automation.** commitlint enforces the commit
  convention; commit-and-tag-version drives versions, tags and this changelog.

### ⚠ Breaking changes

- **Five environment variables were renamed to the `INNODOC_PUBLIC_*` namespace
  (969ac57a). Deployments must rename them in `.env*`, in CI and in the e2e harness:**
  - `INNODOC_APP_ROOT` → `INNODOC_PUBLIC_APP_ROOT`
  - `INNODOC_COURSE_SLUG_MODE` → `INNODOC_PUBLIC_COURSE_SLUG_MODE`
  - `INNODOC_DEFAULT_COURSE_SLUG` → `INNODOC_PUBLIC_DEFAULT_COURSE_SLUG`
  - `INNODOC_PAGE_PATH_PREFIX` → `INNODOC_PUBLIC_PAGE_PATH_PREFIX`
  - `INNODOC_SECTION_PATH_PREFIX` → `INNODOC_PUBLIC_SECTION_PATH_PREFIX`

  Why: the old `envPrefix: 'INNODOC_'` gave the browser build and the server secrets one
  shared namespace, so the JWT secret, the database connection string, the SMTP
  credentials and the Discourse SSO secret were all addressable from client code. Now
  only `INNODOC_PUBLIC_*` crosses to the browser; plain `INNODOC_*` stays server-only and
  is read by `@innodoc/server-env`. A guard test keeps the prefix, the env files and the
  client sources in agreement, so the boundary cannot quietly erode again.

### Migration notes for operators

- Rename the five variables listed above in every environment you run (`.env*` files,
  CI, e2e harness).
- `INNODOC_PUBLIC_*` values are **inlined into the client bundle at build time**: the
  frontend build bakes them in, so they must be set when `pnpm build` runs. Renaming
  them only at server start is not enough — rebuild the frontend after renaming.
- `INNODOC_PUBLIC_COURSE_SLUG_MODE` accepts `SINGLE` (default), `URL` or `SUBDOMAIN`.
  In `SINGLE` mode, `INNODOC_PUBLIC_DEFAULT_COURSE_SLUG` is required.
- The config currently **requires a valid `INNODOC_DISCOURSE_URL`**: omitting or emptying
  it fails config validation, while 1.x supported disabling Discourse by leaving the
  variable empty (the Discourse integration itself is gap G8 below).
- There is no user login yet: do not expect the 1.x auth, progress or forum flows to
  exist in 2.x (see Known gaps vs 1.x).

### Known gaps vs 1.x

2.x is a fresh foundation: it has **no user/auth subsystem, no answer state, no progress
persistence and no question-validator package yet**. The gaps below are increments on
those missing foundations, each verified against the 2.x tree:

- **G1 — Test sections: no evaluation, submit/reset or score persistence (large).**
  1.x showed a "submit test" button, a score display, pass/fail against the course
  `min_score` and persisted `testScores`; in 2.x a `test` section only gets a TOC chip.
- **G2 — Function questions: no point/vector input, and no function validator at all
  (medium–large).** The 1.x mathjs-based `client-question-validators` package has no
  2.x counterpart; function questions cannot be answered or validated yet.
- **G3 — `;` as separator in `if()` / `falls()` piecewise answers (small).** Missing
  together with the function validator (G2).
- **G4 — `markAsSolved` for exercises without questions (small).** 1.x offered a
  "mark as solved" action for exercises with `questionCount === 0`.
- **G5 — Friendly error for unknown exercises (small).** 1.x rendered an
  "Exercise not found!" card; 2.x renders a broken card.
- **G6 — `questionInvalid` handling when a validator throws (small).** 1.x marked the
  question invalid instead of crashing the UI.
- **G7 — `;` as separator in interval answers (small).**
- **G8 — Discourse SSO (medium).** No `/user/discourse-sso` endpoint, no forum nav link,
  no post-login `redirect_to`. Additionally, config validation currently requires a
  valid `INNODOC_DISCOURSE_URL` (see Migration notes).
- **G9 — PDF version nav link (small).** 1.x showed a "download PDF" nav item when a PDF
  was configured.
- **G10 — Manifest `cards` metadata not consumed (medium).** The per-exercise
  `points` / `questionCount` from the course manifest are not read; this blocks G1
  scoring and G4.
- **G11 — Progress upload body limit (small).** Once the progress endpoint exists,
  verify Fastify's 1 MiB default `bodyLimit`, which already matches 1.x's raised limit.

### Features

**Content & rendering**

- Migrate to custom Vite SSR on Fastify with a streaming React renderer 423c776
- Populate the Redux store during SSR using direct database calls 8ba2a9b
- Add the course/content API plugin e82801c
- Add a mock database for manual testing without PostgreSQL 1e76674

**Navigation & transitions**

- Client-side navigation using wouter `Link` components f1a403b
- Replace page transitions with the View Transitions API, holding the page being left
  while a navigation loads and tracking the transition in flight a428fd8, e109835,
  ed5b26e, 9545506
- Client-side redirects for the root and course index routes de70e1e

**Locale & SEO**

- Render a not-yet-translated state for declared locales without content 22b0312
- Warn once when imported content does not cover the declared locales 68d4c78
- Canonicalize each page's own URL and add `x-default` hreflang 7b160ec
- Fall back language-menu labels to the ISO 639-1 name f718856

**UI**

- Replace the TOC stub with MUI X Tree View and add item navigation ac62f09, 863a201

**Configuration**

- Better error handling for invalid configuration aa27455

### Bug Fixes

**Locale & content language**

- Render the response in the locale of its URL 1df3b83
- Let `Accept-Language` alone steer the root redirect 385ac44
- Normalize the route store to the resolved document locale aec8989
- Restrict i18next to supported locales with fallback c99e3c2
- Resolve unoffered course locales on client navigation like SSR 9eedc30
- Fetch an uncached course before correcting its locale 3d64d58
- Keep the same-route fast path on unpublished-locale pages 76a8f79
- Treat a 404 content query as conclusive for the not-yet-translated state 43838fa
- Reject URLs whose locale is not an ISO 639-1 code 1619fcb, 62c9c2b
- Align content error interpolation keys with the locale strings 936aef2

**Navigation**

- Follow the browser's back and forward buttons 66cd215
- Fix client-side navigation for section routes 8a50cf5
- Redirect the root and course index to the course home page fd35aef
- Skip the transition dispatch for a superseded navigation fac659b

**Content rendering**

- Render section content by fixing the hast pipeline 886dd19
- Call the GFM table and strikethrough factories 885d282
- Resolve custom/auto heading id collisions with per-run de-duplication 084509b
- Map `thead` in the component map and dispatch block questions to their components
  e1b31c3, c2dd1a7
- Post a worker result for every parse failure and time out `take()` instead of hanging
  9c57e3a, 400c7a8

**UI**

- Migrate the UI to Material-UI v9 210ce68, 2f4780e, 4dc9dec, 77b24f3, 958c994, 5b06242
- Remove duplicate home links in nav and footer 9ac6b53
- Render nav links on pages without a course cf8bda7

**Server & production**

- Answer 500 with an error page when SSR cannot render ca50024
- Complete the production build and SSR serving pipeline b291cf7
- Serve production over plain HTTP/1.1 ec96a1a
- Prevent swagger dev dependencies from loading in production ba49099
- Gate the mock database on the dev environment 1e0635b
- Default the page URL prefix to `page` 02e2530
