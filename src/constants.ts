import ISO6391 from 'iso-639-1'

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

/** Fragment name for footer A */
export const CONTENT_NAME_FOOTER_A = 'footer_a'
/** Fragment name for footer B */
export const CONTENT_NAME_FOOTER_B = 'footer_b'

/** Content fragment types */
export const CONTENT_FRAGMENT_TYPES = [CONTENT_NAME_FOOTER_A, CONTENT_NAME_FOOTER_B] as const

/** Section types */
export const SECTION_TYPES = ['regular', 'test'] as const

/** Location in the layout where page links can appear */
export const PAGE_LINK_LOCACTIONS = ['nav', 'footer'] as const

/**
 * Content should never be refetched (use highest possible value)
 * https://github.com/reduxjs/redux-toolkit/issues/2535
 */
export const MAX_KEEP_UNUSED_DATA_FOR_MAX = Math.floor((2 ** 31 - 1) / 1000)

/** Default required score to pass a test */
export const DEFAULT_MIN_SCORE = 90

/** Page/section/course name regex */
export const NAME_REGEX = '[a-z0-9_-]+'

/** Locale ISO-639-1 language code */
export const LOCALE_REGEX = '[a-z]{2}'

/** Props to be passed to client */
export const passToClientProps = ['courseName', 'locale', 'preloadedState', 'pageProps'] as const
