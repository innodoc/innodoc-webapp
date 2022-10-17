/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Application base URL */
  readonly INNODOC_APP_ROOT: string

  /** Base URL for content (e.g. `https://example.com/content`) */
  readonly INNODOC_CONTENT_ROOT: string

  /** URL path prefix for content pages (e.g. `page`) */
  readonly INNODOC_PAGE_PATH_PREFIX: string

  /** URL path prefix for sections (e.g. `section`) */
  readonly INNODOC_SECTION_PATH_PREFIX: string

  /** URL to load static files from */
  readonly INNODOC_STATIC_ROOT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
