import type { CamelCasedProperties } from 'type-fest'

import type { PageLinkLocation } from '#types/common'
import type { IconProps } from '#ui/components/common/Icon'

import type { BaseEntity, DbTranslatableFields, TranslatedEntity } from './base'

/** Page object for database */
export interface DbPage extends BaseEntity, DbTranslatableFields {
  /** Page slug (unique within course) */
  slug: string

  /** Course ID */
  course_id: number

  /** Icon string */
  icon?: IconProps['name']

  /** Location in the page layout where a link should appear */
  linked?: PageLinkLocation[]
}

/** Page object as returned by API */
export type ApiPage = CamelCasedProperties<DbPage>

/** Page object as consumed by components */
export type TranslatedPage = TranslatedEntity<ApiPage>
