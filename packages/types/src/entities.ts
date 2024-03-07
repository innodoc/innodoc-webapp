import type { CamelCasedProperties } from 'type-fest'

import type { FRAGMENT_TYPES } from '@innodoc/constants'
import type { BaseEntitySchema, CourseSchema, PageSchema, SectionSchema } from '@innodoc/schema'

import type { TranslatableString } from './common'

/** Base entity returned by the API */
type ApiBaseEntity = CamelCasedProperties<BaseEntitySchema>

/** Entity that has all translatable fields replaced with the actual translation */
type TranslatedEntity<T extends Record<string, unknown>> = {
  [Property in keyof T]: T[Property] extends TranslatableString ? string | null : T[Property]
}
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
  ApiBaseEntity,
  ApiCourse,
  ApiPage,
  ApiSection,
  FragmentType,
  TranslatedCourse,
  TranslatedEntity,
  TranslatedPage,
  TranslatedSection,
}
