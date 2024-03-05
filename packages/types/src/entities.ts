import type { CamelCasedProperties } from 'type-fest'

import type { FRAGMENT_TYPES } from '@innodoc/constants'
import type { CourseSchema, PageSchema, SectionSchema } from '@innodoc/schema'

import { defaultTranslatableFields } from './entities/base'
import type { TranslatableFields, TranslatableString, TranslatedEntity } from './entities/base'
import type { DbQuerySection } from './entities/section'

/** Course object returned by the API */
type ApiCourse = CamelCasedProperties<CourseSchema>

/** Course with translated fields */
type TranslatedCourse = TranslatedEntity<ApiCourse>

/** Page object returned by the API */
type ApiPage = CamelCasedProperties<PageSchema>

/** Page with translated fields */
type TranslatedPage = TranslatedEntity<ApiPage>

/** Section object returned by the API */
type ApiSection = CamelCasedProperties<SectionSchema>

/** Section with translated fields */
type TranslatedSection = TranslatedEntity<ApiSection>

/** Content fragment type */
type FragmentType = (typeof FRAGMENT_TYPES)[number]

export type {
  ApiCourse,
  ApiPage,
  ApiSection,
  DbQuerySection,
  FragmentType,
  TranslatableFields,
  TranslatableString,
  TranslatedCourse,
  TranslatedEntity,
  TranslatedPage,
  TranslatedSection,
}
export { defaultTranslatableFields }
