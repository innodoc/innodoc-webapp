/** Built-in pages */
export const BUILTIN_PAGES_KEYS = ['___INDEX_PAGE___', '___TOC___', '___PROGRESS___'] as const
export const BUILTIN_PAGES: BuiltinPages = {
  ___INDEX_PAGE___: {
    path: '/index-page',
    title: 'internalPages.indexPage.title',
  },
  ___TOC___: {
    path: '/toc',
    title: 'internalPages.toc.title',
  },
  ___PROGRESS___: {
    path: '/progress',
    title: 'internalPages.progress.title',
  },
}

export type BuiltinPagesKey = typeof BUILTIN_PAGES_KEYS[number]
type BuiltinPages = Record<BuiltinPagesKey, BuiltinPage>
type BuiltinPage = {
  /** URL path */
  path: string
  /** Page title i18n key */
  title: string
}

/** Filename for footer A content */
export const CONTENT_NAME_FOOTER_A = 'footerA'
/** Filename for footer B content */
export const CONTENT_NAME_FOOTER_B = 'footerB'

/**
 * Content should never be refetched (use highest possible value)
 * https://github.com/reduxjs/redux-toolkit/issues/2535
 */
export const MAX_KEEP_UNUSED_DATA_FOR_MAX = Math.floor((2 ** 31 - 1) / 1000)
