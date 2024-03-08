import type { LanguageCode } from 'iso-639-1'

import { isTranslatableString } from '@innodoc/schema/typeGuards'
import type { TranslatableString } from '@innodoc/types/common'
import type { ApiBaseEntity, TranslatedEntity } from '@innodoc/types/entities'

/** Translate entity */
function translatedEntity<T extends ApiBaseEntity>(entity: T, locale: LanguageCode) {
  const translatedEntity = {} as TranslatedEntity<T>
  for (const [k, v] of Object.entries(entity) as [keyof T, TranslatedEntity<T>[keyof T]][]) {
    translatedEntity[k] = (isTranslatableString(v) ? v[locale] ?? null : v) as T[typeof k] extends TranslatableString
      ? string | null
      : T[typeof k]
  }
  return translatedEntity
}

/** Translate array of entities */
function translateEntityArray<T extends ApiBaseEntity>(entities: T[], locale: LanguageCode) {
  return entities.map((entity) => translatedEntity(entity, locale))
}

export { translatedEntity as translateEntity, translateEntityArray }
