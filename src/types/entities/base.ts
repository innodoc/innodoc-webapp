import camelCase from 'camelcase'
import type { LanguageCode } from 'iso-639-1'
import type { CamelCase } from 'type-fest'

import type { FRAGMENT_TYPES } from '#constants'
import type { DateISO8601 } from '#types/common'

/** Base database entity */
export interface BaseEntity {
  /** Primary key */
  id: number

  /** Creation date */
  created_at: DateISO8601

  /** Update date */
  updated_at: DateISO8601
}

/** Default fields that are translatable (snake case) */
export const dbDefaultTranslatableFields = ['title', 'short_title'] as const

/** Default fields that are translatable (camel case) */
export const defaultTranslatableFields = dbDefaultTranslatableFields.map((key) =>
  camelCase(key)
) as CamelCase<DbDefaultTranslatableFields>[]

/** Default fields that are translatable */
export type DbDefaultTranslatableFields = typeof dbDefaultTranslatableFields[number]

/** Field that holds string in different languages */
export type TranslatableString = Record<LanguageCode, string> | null

/** Mixin for entity with localized fields */
export type TranslatableFields<T extends string> = Record<T, TranslatableString>

/** Mixin for entity with localized fields (camel case) */
export type DbTranslatableFields<T extends string = DbDefaultTranslatableFields> =
  TranslatableFields<T>

/** Replace all localized fields with strings */
export type TranslatedEntity<T extends Record<string, unknown>> = {
  [Property in keyof T]: T[Property] extends TranslatableString ? string | null : T[Property]
}

/** Content fragment type */
export type FragmentType = typeof FRAGMENT_TYPES[number]
