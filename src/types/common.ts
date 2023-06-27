import type { LanguageCode } from 'iso-639-1'

import type {
  CONTENT_TYPES,
  COURSE_SLUG_MODES,
  PAGE_LINK_LOCACTIONS,
  SECTION_TYPES,
} from '#constants'
import type { HastRoot } from '#markdown/markdownToHast/markdownToHast'

import type { ApiCourse } from './entities/course'
import type { ApiPage } from './entities/page'
import type { ApiSection } from './entities/section'
import type { AppRouteName } from './routes'

/** Arbitrary object */
export interface ArbitraryObject {
  [key: string]: unknown
}

/** Location in the layout where page links can appear */
export type PageLinkLocation = (typeof PAGE_LINK_LOCACTIONS)[number]

/** Section type */
export type SectionType = (typeof SECTION_TYPES)[number]

/** Course slug mode */
export type CourseSlugMode = (typeof COURSE_SLUG_MODES)[number]

/** Content types */
export type ContentType = (typeof CONTENT_TYPES)[number]

/** Application route info */
export interface RouteInfo {
  /** Course slug */
  courseSlug: ApiCourse['slug'] | null

  /** Route name */
  routeName: AppRouteName

  /** Current locale */
  locale: LanguageCode

  /** Page slug */
  pageSlug?: ApiPage['slug']

  /** Section path */
  sectionPath?: ApiSection['path']
}

export interface WithContentHash {
  /** CRC32 hash of content */
  hash: string
}

export interface ContentWithHash extends WithContentHash {
  /** Markdown string */
  content: string
}

export interface HastRootWithHash extends WithContentHash {
  /** hast Root */
  root: HastRoot
}
