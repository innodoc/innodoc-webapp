import type { LanguageCode } from 'iso-639-1'

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

/** Default locales */
const DEFAULT_LOCALES = ['en'] as readonly LanguageCode[]

/**
 * Content should never be refetched (use highest possible value)
 * https://github.com/reduxjs/redux-toolkit/issues/2535
 */
const MAX_KEEP_UNUSED_DATA_FOR_MAX = Math.floor((2 ** 31 - 1) / 1000)

/** Default required score to pass a test */
const DEFAULT_MIN_SCORE = 90

/** Slug regex (for PostgreSQL) */
const SLUG_RE = '[a-z0-9]+(-[a-z0-9]+)*'

/** Section path regex */
const PATH_RE = String.raw`[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*){0,10}`

/** Extract course slug from subdomain/url */
const COURSE_SLUG_MODES = ['SUBDOMAIN', 'URL', 'SINGLE'] as const

/** Default course slug mode */
const DEFAULT_COURSE_SLUG_MODE = 'SINGLE'

/** Props to be passed to client */
const PASS_TO_CLIENT_PROPS = ['is404', 'preloadedState', 'routeInfo', 'routeParams'] as const

/** API path prefix */
const API_PREFIX = '/api'

/** API course path prefix */
const API_COURSE_PREFIX = '/course'

/** Content card types */
const CARD_TYPES = ['example', 'exercise', 'hint', 'info', 'inputHint'] as const

/** Possible names for custom hast MDX flow element */
const HAST_MDX_JSX_FLOW_DIV_ELEMENT_NAME = [
  'Example',
  'Exercise',
  'Grid',
  'GridItem',
  'Hint',
  'Info',
  'InputHint',
  'Solution',
  'Table',
  'Tabs',
  'TabItem',
  'TextQuestion',
  'Video',
  'YouTube',
] as const

/** Possible names for custom hast MDX text element */
const HAST_MDX_JSX_TEXT_SPAN_ELEMENT_NAME = ['TextQuestion'] as const

export {
  API_COURSE_PREFIX,
  API_PREFIX,
  CARD_TYPES,
  CONTENT_TYPES,
  COURSE_SLUG_MODES,
  DEFAULT_COURSE_SLUG_MODE,
  DEFAULT_LOCALES,
  DEFAULT_MIN_SCORE,
  DEFAULT_PAGE_PATH_PREFIX,
  DEFAULT_ROUTE_NAME,
  DEFAULT_SECTION_PATH_PREFIX,
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
}
