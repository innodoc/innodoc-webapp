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
interface BuiltinPage {
  /** URL path */
  path: string
  /** Page title i18n key */
  title: string
}

/** Fragment name for footer A */
export const CONTENT_NAME_FOOTER_A = 'footer-a'
/** Fragment name for footer B */
export const CONTENT_NAME_FOOTER_B = 'footer-b'

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

/** Page/section/course slug regex */
export const SLUG_RE = '[a-z0-9]+(?:-[a-z0-9]+)*'

/** Page/section/course slug regex (Posix variant for PostgreSQL) */
export const SLUG_RE_POSIX = SLUG_RE.replace('(?:', '(')

/** Props to be passed to client */
export const passToClientProps = ['courseId', 'locale', 'preloadedState', 'pageProps'] as const

/** Emotion style cache key */
export const EMOTION_STYLE_KEY = 'emotion-style'

/** Emotion style insertion point meta name */
export const EMOTION_STYLE_INSERTION_POINT_NAME = 'emotion-insertion-point'
