// import camelCase from 'camelcase'
import type { LanguageCode } from 'iso-639-1'
import type { CamelCase } from 'type-fest'

// TODO delete all

/** Base database entity */
interface BaseEntity {
  /** Primary key */
  id: number

  /** Creation date (ISO8601) */
  created_at: string

  /** Update date (ISO8601) */
  updated_at: string
}

/** Default fields that are translatable (snake case) */
const dbDefaultTranslatableFields = ['title', 'short_title'] as const

/** Default fields that are translatable (camel case) */
// const defaultTranslatableFields = dbDefaultTranslatableFields.map((key) =>
//   camelCase(key),
// ) as CamelCase<DbDefaultTranslatableFields>[]
const defaultTranslatableFields = [] as CamelCase<DbDefaultTranslatableFields>[]

/** Default fields that are translatable */
type DbDefaultTranslatableFields = (typeof dbDefaultTranslatableFields)[number]

/** Field that holds string in different languages */
type TranslatableString = Partial<Record<LanguageCode, string>> | null

/** Mixin for entity with localized fields */
type TranslatableFields<T extends string> = Record<T, TranslatableString>

/** Mixin for entity with localized fields (camel case) */
type DbTranslatableFields<T extends string = DbDefaultTranslatableFields> = TranslatableFields<T>

/** Replace all localized fields with strings */
type TranslatedEntity<T extends Record<string, unknown>> = {
  [Property in keyof T]: T[Property] extends TranslatableString ? string | null : T[Property]
}

export type {
  BaseEntity,
  DbDefaultTranslatableFields,
  DbTranslatableFields,
  TranslatableFields,
  TranslatableString,
  TranslatedEntity,
}
export { dbDefaultTranslatableFields, defaultTranslatableFields }
