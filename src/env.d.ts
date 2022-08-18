/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for content (e.g. `https://example.com/content`) */
  readonly INNODOC_CONTENT_ROOT: string

  /** Custom Iconify JSON icon bundle */
  readonly INNODOC_ICON_DATA: import('@iconify/types').IconifyJSON

  /** Supported locales */
  readonly INNODOC_LOCALES: import('./types/common').Locale[]

  /** URL path prefix for content pages (e.g. `page`) */
  readonly INNODOC_PAGE_PATH_PREFIX: string

  /** URL path prefix for sections (e.g. `section`) */
  readonly INNODOC_SECTION_PATH_PREFIX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
