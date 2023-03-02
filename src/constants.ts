/** Fragment type for footer A */
export const FRAGMENT_TYPE_FOOTER_A = 'footer-a'

/** Fragment type for footer B */
export const FRAGMENT_TYPE_FOOTER_B = 'footer-b'

/** Content fragment types */
export const FRAGMENT_TYPES = [FRAGMENT_TYPE_FOOTER_A, FRAGMENT_TYPE_FOOTER_B] as const

/** Content types */
export const CONTENT_TYPES = ['page', 'section'] as const

/** Section types */
export const SECTION_TYPES = ['regular', 'test'] as const

/** Location in the layout where page links can appear */
export const PAGE_LINK_LOCACTIONS = ['nav', 'footer'] as const

/** Default section path prefix */
export const DEFAULT_SECTION_PATH_PREFIX = 'section'

/** Default page path prefix */
export const DEFAULT_PAGE_PATH_PREFIX = 'section'

/** Default route name */
export const DEFAULT_ROUTE_NAME = 'app:index'

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

/** Section path regex */
export const PATH_RE = '[a-z0-9]+(?:-[a-z0-9]+)*(?:\\/[a-z0-9]+(?:-[a-z0-9]+)*){0,10}'

/** Extract course slug from subdomain/url */
export const COURSE_SLUG_MODES = ['SUBDOMAIN', 'URL', 'DISABLE'] as const

/** Props to be passed to client */
export const PASS_TO_CLIENT_PROPS = ['preloadedState', 'routeInfo', 'routeParams'] as const

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
