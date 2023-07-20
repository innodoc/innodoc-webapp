import type { LanguageCode } from 'iso-639-1'
import type { CamelCasedProperties } from 'type-fest'

import type { BaseEntity, TranslatableFields, TranslatedEntity } from '@innodoc/types/entities'

type TranslatableBaseEntity<F extends string> = CamelCasedProperties<BaseEntity> &
  TranslatableFields<F>

/** Translate entity */
export function translateEntity<T extends TranslatableBaseEntity<F>, F extends string>(
  entity: T,
  fields: F[],
  locale: LanguageCode
) {
  return fields.reduce(
    (acc, field) =>
      acc[field] !== null
        ? {
            ...acc,
            [field]: entity[field]?.[locale],
          }
        : acc,
    { ...entity }
  ) as TranslatedEntity<T>
}

/** Translate array of entities */
export function translateEntityArray<T extends TranslatableBaseEntity<F>, F extends string>(
  entities: T[],
  fields: F[],
  locale: LanguageCode
) {
  return entities.map((entity) => translateEntity(entity, fields, locale))
}
