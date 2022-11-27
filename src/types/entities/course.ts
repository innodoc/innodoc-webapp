import type { LanguageCode } from 'iso-639-1'
import type { CamelCasedProperties } from 'type-fest'

import type {
  BaseEntity,
  DbDefaultTranslatableFields,
  DbTranslatableFields,
  TranslatedEntity,
} from './base'

/** Course fields that are translatable */
export type DbCourseTranslatableFields = DbDefaultTranslatableFields | 'description'

/** Course object for database */
export interface DbCourse extends BaseEntity, DbTranslatableFields<DbCourseTranslatableFields> {
  /** Course identifier */
  name: string

  /** Course home link */
  home_link: string

  /** Course locales */
  locales: ReadonlyArray<LanguageCode>

  /** Minimal score a user has to achieve for a test to be passed */
  min_score?: number

  /** Course logo URL or identifier */
  logo?: string
}

/** Course as returned by API */
export type ApiCourse = CamelCasedProperties<DbCourse>

/** Course as consumed by components */
export type TranslatedCourse = TranslatedEntity<ApiCourse>
