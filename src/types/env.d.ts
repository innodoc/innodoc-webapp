/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for content (e.g. `https://example.com/content`) */
  readonly INNODOC_CONTENT_ROOT: string

  /** URL path prefix for content pages (e.g. `page`) */
  readonly INNODOC_PAGE_PATH_PREFIX: string

  /** URL path prefix for sections (e.g. `section`) */
  readonly INNODOC_PAGE_SECTION_PREFIX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
