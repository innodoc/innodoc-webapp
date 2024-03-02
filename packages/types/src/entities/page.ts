import type { CamelCasedProperties } from 'type-fest'

import type { PageLinkLocation } from '#common'

import type { BaseEntity, DbTranslatableFields, TranslatedEntity } from './base'

/** Page object for database */
interface DbPage extends BaseEntity, DbTranslatableFields {
  /** Page slug (unique within course) */
  slug: string

  /** Course ID */
  course_id: number

  /** Icon name */
  icon?: string

  /** Location in the page layout where a link should appear */
  linked?: PageLinkLocation[]
}

/** Page object as returned by API */
type ApiPage = CamelCasedProperties<DbPage>

/** Page object as consumed by components */
type TranslatedPage = TranslatedEntity<ApiPage>

export type { ApiPage, DbPage, TranslatedPage }
