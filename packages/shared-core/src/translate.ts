import { isTranslatableString } from '#typeguards/content'
import type { ApiBaseEntity, LanguageCode, TranslatableString, TranslatedEntity } from '#types'

/**
 * Translate one API entity for a locale: every `TranslatableString` field is replaced by the
 * string for `locale` (`null` when the locale is missing), every other field is kept as is.
 *
 * Pure `(entity, locale) → entity` with no React-side imports, so it lives in `@innodoc/shared-core`
 * rather than in `ui-shared`: the store layer (`@innodoc/shared-store`) may not import from
 * `ui-*` (see AGENTS.md, enforced by `pnpm depcruise:validate`), and it translates entities in its
 * section/page selectors. One shared implementation is also what gives every consumer the same
 * translated objects.
 */
function translateEntity<T extends ApiBaseEntity>(entity: T, locale: LanguageCode) {
  const translatedEntity = {} as TranslatedEntity<T>
  for (const [k, v] of Object.entries(entity) as [keyof T, TranslatedEntity<T>[keyof T]][]) {
    translatedEntity[k] = (
      isTranslatableString(v) && v != null ? (v[locale] ?? null) : v
    ) as T[typeof k] extends TranslatableString ? string | null : T[typeof k]
  }
  return translatedEntity
}

/** Translate an array of entities (see {@link translateEntity}) */
function translateEntityArray<T extends ApiBaseEntity>(entities: T[], locale: LanguageCode) {
  return entities.map((entity) => translateEntity(entity, locale))
}

export { translateEntity, translateEntityArray }
