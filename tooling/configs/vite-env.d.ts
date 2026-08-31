/**
 * Environment variables available to client-side code through `import.meta.env`.
 *
 * The frontend build (see `apps/frontend/vite.config.ts`) is configured with
 * `envPrefix: 'INNODOC_PUBLIC_'`, so ONLY `INNODOC_PUBLIC_*` variables are ever inlined into
 * browser code. Everything else on the plain `INNODOC_` prefix (JWT secret, database connection
 * string, SMTP credentials, Discourse SSO secret, ...) is server-only and is read through
 * `@innodoc/server-env`, never through `import.meta.env`.
 *
 * Keep this list free of secrets: `vite/client` widens `ImportMetaEnv` with an index signature,
 * so TypeScript will not stop you from reading an unlisted `INNODOC_*` variable here. The
 * `envPrefix` above is what actually keeps secrets out of the bundle; the guard test in
 * `apps/frontend/src/env-exposure.test.ts` is what keeps code and config in agreement.
 */
interface ImportMetaEnv {
  /** Application base URL (URL the app is available from the outside), used for the canonical `<link>`. */
  readonly INNODOC_PUBLIC_APP_ROOT: string

  /** Course slug mode (SUBDOMAIN, URL, SINGLE) */
  readonly INNODOC_PUBLIC_COURSE_SLUG_MODE: string

  /** URL path prefix for content pages (e.g. `page`) */
  readonly INNODOC_PUBLIC_PAGE_PATH_PREFIX: string

  /** URL path prefix for sections (e.g. `section`) */
  readonly INNODOC_PUBLIC_SECTION_PATH_PREFIX: string

  /** Default course slug when using course slug mode `SINGLE` */
  readonly INNODOC_PUBLIC_DEFAULT_COURSE_SLUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
