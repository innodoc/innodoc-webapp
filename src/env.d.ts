/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Application base URL */
  readonly INNODOC_APP_ROOT: string

  /** URL path prefix for content pages (e.g. `page`) */
  readonly INNODOC_PAGE_PATH_PREFIX: string

  /** URL path prefix for sections (e.g. `section`) */
  readonly INNODOC_SECTION_PATH_PREFIX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
