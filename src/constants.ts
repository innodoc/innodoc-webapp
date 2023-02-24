/** Built-in pages */
export const BUILTIN_PAGES_KEYS = ['___INDEX_PAGE___', '___TOC___', '___PROGRESS___'] as const
export const BUILTIN_PAGES: BuiltinPages = {
  ___INDEX_PAGE___: {
    path: 'app:glossary',
    title: 'internalPages.glossary.title',
  },
  ___TOC___: {
    path: 'app:toc',
    title: 'internalPages.toc.title',
  },
  ___PROGRESS___: {
    path: 'app:progress',
    title: 'internalPages.progress.title',
  },
}

export type BuiltinPagesKey = (typeof BUILTIN_PAGES_KEYS)[number]
type BuiltinPages = Record<BuiltinPagesKey, BuiltinPage>
interface BuiltinPage {
  /** URL path */
  path: string
  /** Page title i18n key */
  title: string
}

/** Fragment type for footer A */
export const FRAGMENT_TYPE_FOOTER_A = 'footer-a'

/** Fragment type for footer B */
export const FRAGMENT_TYPE_FOOTER_B = 'footer-b'

/** Content fragment types */
export const FRAGMENT_TYPES = [FRAGMENT_TYPE_FOOTER_A, FRAGMENT_TYPE_FOOTER_B] as const

/** Section types */
export const SECTION_TYPES = ['regular', 'test'] as const

/** Location in the layout where page links can appear */
export const PAGE_LINK_LOCACTIONS = ['nav', 'footer'] as const

/** Default section path prefix */
export const DEFAULT_SECTION_PATH_PREFIX = 'section'

/** Default page path prefix */
export const DEFAULT_PAGE_PATH_PREFIX = 'section'

/**
 * Content should never be refetched (use highest possible value)
 * https://github.com/reduxjs/redux-toolkit/issues/2535
 */
export const MAX_KEEP_UNUSED_DATA_FOR_MAX = Math.floor((2 ** 31 - 1) / 1000)

/** Default required score to pass a test */
export const DEFAULT_MIN_SCORE = 90

/** Page/section/course slug regex */
export const SLUG_RE = '[a-z0\\d]+(?:-[a-z\\d]+)*'

/** Page/section/course slug regex (Posix variant for PostgreSQL) */
export const SLUG_RE_POSIX = SLUG_RE.replace('(?:', '(')

/** Page/section/course slug regex */
export const PATH_RE = '[a-z\\d]+(?:-[a-z\\d]+)*(?:\\/[a-z\\d]+(?:-[a-z\\d]+)*){0,10}'

/** Fragment type regex */
export const FRAGMENT_RE = `(?:${FRAGMENT_TYPES.join('|')})`

/** Extract course slug from subdomain/url */
export const COURSE_SLUG_MODES = ['SUBDOMAIN', 'URL', 'DISABLE'] as const

/** Props to be passed to client */
export const passToClientProps = ['courseId', 'locale', 'preloadedState', 'routeParams'] as const

/** Emotion style cache key */
export const EMOTION_STYLE_KEY = 'emotion-style'

/** Emotion style insertion point meta name */
export const EMOTION_STYLE_INSERTION_POINT_NAME = 'emotion-insertion-point'

/** API path prefix */
export const API_PREFIX = '/api'

/** Course path prefix */
export const COURSE_PREFIX = '/course'

/** API/course prefix */
export const API_COURSE_PREFIX = `${API_PREFIX}${COURSE_PREFIX}`
