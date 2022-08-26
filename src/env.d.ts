/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Application base URL */
  readonly INNODOC_APP_ROOT: string

  /** Base URL for content (e.g. `https://example.com/content`) */
  readonly INNODOC_CONTENT_ROOT: string

  /** Custom Iconify JSON icon bundle */
  readonly INNODOC_ICON_DATA: Record<string, import('svg-parser').RootNode>

  /** Supported locales */
  readonly INNODOC_LOCALES: import('./types/common').Locale[]

  /** Logo SVG data */
  readonly INNODOC_LOGO_DATA: import('svg-parser').RootNode | undefined

  /** URL path prefix for content pages (e.g. `page`) */
  readonly INNODOC_PAGE_PATH_PREFIX: string

  /** URL path prefix for sections (e.g. `section`) */
  readonly INNODOC_SECTION_PATH_PREFIX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
