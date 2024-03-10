import type { CamelCasedProperties } from 'type-fest'
import type z from 'zod'

import type { courseSchema, fragmentTypeSchema, pageSchema, querySectionSchema, sectionSchema } from './entities'
import type { baseEntity } from './entities/base'

type BaseEntitySchema = z.infer<typeof baseEntity>
type CourseSchema = z.infer<typeof courseSchema>
type FragmentTypeSchema = z.infer<typeof fragmentTypeSchema>
type PageSchema = z.infer<typeof pageSchema>
type SectionSchema = z.infer<typeof sectionSchema>
type QuerySectionSchema = z.infer<typeof querySectionSchema>

/** Base entity returned by the API */
type ApiBaseEntity = CamelCasedProperties<BaseEntitySchema>

/** Field that holds a string in different languages */
type TranslatableString = Record<string, string> | null

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
type ApiSection = CamelCasedProperties<QuerySectionSchema>

/** Section with translated fields */
type TranslatedSection = TranslatedEntity<ApiSection>

export type {
  ApiBaseEntity,
  ApiCourse,
  ApiPage,
  ApiSection,
  BaseEntitySchema,
  CourseSchema,
  FragmentTypeSchema,
  PageSchema,
  QuerySectionSchema,
  SectionSchema,
  TranslatableString,
  TranslatedCourse,
  TranslatedEntity,
  TranslatedPage,
  TranslatedSection,
}
