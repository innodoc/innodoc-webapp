import type { LanguageCode } from 'iso-639-1'

import type { LocalizedString, DateISO8601, PageLinkLocation, SectionType } from '#types/common'
import type { IconProps } from '#ui/components/common/Icon'

export interface BaseModel {
  /** Primary key */
  id: number

  /** Creation date */
  created_at: DateISO8601

  /** Update date */
  updated_at: DateISO8601
}

/** Mixin for database object with localized titles */
export interface DbLocalizedTitles {
  /** Short localized version of the title for places with limited space */
  short_title?: LocalizedString

  /** Localized title */
  title: LocalizedString
}

/** Course object for database */
export interface DbCourse extends BaseModel, DbLocalizedTitles {
  /** Course identifier */
  name: string

  /** Course home link */
  home_link: string

  /** Course locales */
  locales: ReadonlyArray<LanguageCode>

  /** Minimal score a user has to achieve for a test to be passed */
  min_score?: number

  /** Course description */
  description?: LocalizedString

  /** Course logo URL or identifier */
  logo?: string
}

/** Page object for database */
export interface DbPage extends BaseModel, DbLocalizedTitles {
  /** Page identifier (unique within course) */
  name: string

  /** Course ID */
  course_id: number

  /** Icon string */
  icon?: IconProps['name']

  /** Location in the page layout where a link should appear */
  linked?: PageLinkLocation[]
}

/** Section object for database */
export interface DbSection extends BaseModel, DbLocalizedTitles {
  /** Section path */
  path: string

  /** Course ID */
  course_id: number

  /** Parent path */
  parent: string | null

  /** Section type */
  type: SectionType

  /** Order in table of contents */
  order: number
}
