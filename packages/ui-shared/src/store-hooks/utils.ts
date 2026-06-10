import type { LanguageCode } from 'iso-639-1'
import { isTranslatableString } from '@innodoc/shared-core/typeguards'
import type { ApiBaseEntity, TranslatableString, TranslatedEntity } from '@innodoc/shared-core/types'

/** Translate entity */
function translateEntity<T extends ApiBaseEntity>(entity: T, locale: LanguageCode) {
  const translatedEntity = {} as TranslatedEntity<T>
  for (const [k, v] of Object.entries(entity) as [keyof T, TranslatedEntity<T>[keyof T]][]) {
    translatedEntity[k] = (
      isTranslatableString(v) ? (v?.[locale] ?? null) : v
    ) as T[typeof k] extends TranslatableString ? string | null : T[typeof k]
  }
  return translatedEntity
}

/** Translate array of entities */
function translateEntityArray<T extends ApiBaseEntity>(entities: T[], locale: LanguageCode) {
  return entities.map((entity) => translateEntity(entity, locale))
}

export { translateEntity, translateEntityArray }
