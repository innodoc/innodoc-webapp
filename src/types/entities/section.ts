import type { CamelCasedProperties } from 'type-fest'

import type { SectionType } from '#types/common'

import type { BaseEntity, DbTranslatableFields, TranslatedEntity } from './base'

/** Section object for database */
export interface DbSection extends BaseEntity, DbTranslatableFields {
  /** Section path */
  path: string

  /** Course ID */
  course_id: number

  /** Parent ID */
  parent_id: number | null

  /** Section type */
  type: SectionType

  /** Sort order within parent */
  order: number
}

/** Section object returned by database query. */
export interface DbQuerySection extends Omit<DbSection, 'order'> {
  /** Array of section orders from the root section up to this section */
  order: number[]
}

/** Section object as returned by API */
export type ApiSection = CamelCasedProperties<DbQuerySection>

/** Section object as consumed by components */
export type TranslatedSection = TranslatedEntity<ApiSection>

/** Section tree with chldren (used by Toc components) */
export interface SectionWithChildren extends TranslatedSection {
  children: SectionWithChildren[]
}
