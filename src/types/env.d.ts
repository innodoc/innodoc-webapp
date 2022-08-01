/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for content (e.g. `https://example.com/content`) */
  readonly INNODOC_CONTENT_ROOT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
