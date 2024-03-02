/** Fragment type for footer A */
const FRAGMENT_TYPE_FOOTER_A = 'footer-a'

/** Fragment type for footer B */
const FRAGMENT_TYPE_FOOTER_B = 'footer-b'

/** Content fragment types */
const FRAGMENT_TYPES = [FRAGMENT_TYPE_FOOTER_A, FRAGMENT_TYPE_FOOTER_B] as const

/** Content types */
const CONTENT_TYPES = ['page', 'section'] as const

/** Section types */
const SECTION_TYPES = ['regular', 'test'] as const

/** Location in the layout where page links can appear */
const PAGE_LINK_LOCACTIONS = ['nav', 'footer'] as const

/** Default section path prefix */
const DEFAULT_SECTION_PATH_PREFIX = 'section'

/** Default page path prefix */
const DEFAULT_PAGE_PATH_PREFIX = 'section'

/** Default route name */
const DEFAULT_ROUTE_NAME = 'app:index'

/**
 * Content should never be refetched (use highest possible value)
 * https://github.com/reduxjs/redux-toolkit/issues/2535
 */
const MAX_KEEP_UNUSED_DATA_FOR_MAX = Math.floor((2 ** 31 - 1) / 1000)

/** Default required score to pass a test */
const DEFAULT_MIN_SCORE = 90

/** Page/section/course slug regex */
const SLUG_RE = '[a-z0-9]+(?:-[a-z0-9]+)*'

/** Page/section/course slug regex (Posix variant for PostgreSQL) */
const SLUG_RE_POSIX = SLUG_RE.replace('(?:', '(')

/** Section path regex */
const PATH_RE = '[a-z0-9]+(?:-[a-z0-9]+)*(?:\\/[a-z0-9]+(?:-[a-z0-9]+)*){0,10}'

/** Extract course slug from subdomain/url */
const COURSE_SLUG_MODES = ['SUBDOMAIN', 'URL', 'DISABLE'] as const

/** Props to be passed to client */
const PASS_TO_CLIENT_PROPS = ['preloadedState', 'routeInfo', 'routeParams'] as const

/** Emotion style cache key */
const EMOTION_STYLE_KEY = 'emotion-style'

/** Emotion style insertion point meta name */
const EMOTION_STYLE_INSERTION_POINT_NAME = 'emotion-insertion-point'

/** API path prefix */
const API_PREFIX = '/api'

/** Course path prefix */
const COURSE_PREFIX = '/course'

/** API/course prefix */
const API_COURSE_PREFIX = `${API_PREFIX}${COURSE_PREFIX}`

/** Possible names for custom hast MDX flow element */
const HAST_MDX_JSX_FLOW_DIV_ELEMENT_NAME = [
  'Example',
  'Exercise',
  'Hint',
  'Info',
  'InputHint',
  'Solution',
  'Tabs',
  'TabItem',
] as const

/** Possible names for custom hast MDX text element */
const HAST_MDX_JSX_TEXT_SPAN_ELEMENT_NAME = ['TextQuestion'] as const

export {
  API_COURSE_PREFIX,
  API_PREFIX,
  CONTENT_TYPES,
  COURSE_PREFIX,
  COURSE_SLUG_MODES,
  DEFAULT_MIN_SCORE,
  DEFAULT_PAGE_PATH_PREFIX,
  DEFAULT_ROUTE_NAME,
  DEFAULT_SECTION_PATH_PREFIX,
  EMOTION_STYLE_INSERTION_POINT_NAME,
  EMOTION_STYLE_KEY,
  FRAGMENT_TYPE_FOOTER_A,
  FRAGMENT_TYPE_FOOTER_B,
  FRAGMENT_TYPES,
  HAST_MDX_JSX_FLOW_DIV_ELEMENT_NAME,
  HAST_MDX_JSX_TEXT_SPAN_ELEMENT_NAME,
  MAX_KEEP_UNUSED_DATA_FOR_MAX,
  PAGE_LINK_LOCACTIONS,
  PASS_TO_CLIENT_PROPS,
  PATH_RE,
  SECTION_TYPES,
  SLUG_RE,
  SLUG_RE_POSIX,
}
