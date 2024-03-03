import type { CamelCasedProperties } from 'type-fest'

import { defaultTranslatableFields } from './entities/base'
import type {
  BaseEntity,
  TranslatableFields,
  TranslatableString,
  TranslatedEntity,
} from './entities/base'
import type { FragmentType } from './entities/fragment'
import type { ApiPage, DbPage, TranslatedPage } from './entities/page'
import type { ApiSection, DbQuerySection, DbSection, TranslatedSection } from './entities/section'
import type { DbCourseSchema } from './schema'

/** Course object returned by the API */
type ApiCourse = CamelCasedProperties<DbCourseSchema>

/** Course with translated fields */
type TranslatedCourse = TranslatedEntity<ApiCourse>

export type {
  ApiCourse,
  ApiPage,
  ApiSection,
  BaseEntity,
  DbPage,
  DbQuerySection,
  DbSection,
  FragmentType,
  TranslatableFields,
  TranslatableString,
  TranslatedCourse,
  TranslatedEntity,
  TranslatedPage,
  TranslatedSection,
}
export { defaultTranslatableFields }
