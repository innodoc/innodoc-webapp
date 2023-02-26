import type { LanguageCode } from 'iso-639-1'

import type { COURSE_SLUG_MODES, PAGE_LINK_LOCACTIONS, SECTION_TYPES } from '#constants'

import type { ApiPage } from './entities/page'
import type { ApiSection } from './entities/section'

/** Location in the layout where page links can appear */
export type PageLinkLocation = (typeof PAGE_LINK_LOCACTIONS)[number]

/** Section type */
export type SectionType = (typeof SECTION_TYPES)[number]

/** Course slug mode */
export type CourseSlugMode = (typeof COURSE_SLUG_MODES)[number]

/** Application route info */
export interface RouteInfo {
  /** Route name */
  routeName: string
  locale: LanguageCode
  pageSlug?: ApiPage['slug']
  sectionPath?: ApiSection['path']
}
