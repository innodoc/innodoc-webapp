import type iconBundle from '@innodoc/commands/icon-bundle'
import type { CamelCasedProperties } from 'type-fest'

import type { PageLinkLocation } from '#common'

import type { BaseEntity, DbTranslatableFields, TranslatedEntity } from './base'

/** Page object for database */
export interface DbPage extends BaseEntity, DbTranslatableFields {
  /** Page slug (unique within course) */
  slug: string

  /** Course ID */
  course_id: number

  /** Icon name */
  icon?: keyof typeof iconBundle

  /** Location in the page layout where a link should appear */
  linked?: PageLinkLocation[]
}

/** Page object as returned by API */
export type ApiPage = CamelCasedProperties<DbPage>

/** Page object as consumed by components */
export type TranslatedPage = TranslatedEntity<ApiPage>
