import { createSelector } from '@reduxjs/toolkit'
import { EMPTY_TRANSLATED_PAGES } from '@innodoc/shared-core/sentinels'
import { translateEntity } from '@innodoc/shared-core/translate'
import type { ApiPage, LanguageCode, PageLinkLocation, TranslatedPage } from '@innodoc/shared-core/types'

/**
 * One translated copy of every page, plus the two indexes every consumer needs.
 *
 * `localized` / `linked` preserve the API's order (the nav/footer link lists have always
 * followed it); if a view ever needs a different order, sort **once in this index** - never per
 * view, which would rebuild the order on every consumer.
 */
interface PageIndex {
  /** Every page, translated, in API order */
  readonly localized: TranslatedPage[]
  /** page.slug → page */
  readonly bySlug: Map<string, TranslatedPage>
  /** link location → pages linked there, in API order */
  readonly linked: Map<PageLinkLocation, TranslatedPage[]>
}

/**
 * Module scope, on purpose: one instance for the whole app. Reselect 5's default
 * `weakMapMemoize` keys the cache trie by the RTK Query `data` array (per store, collected with
 * it, so SSR requests never share stale entries) and by the primitive `locale`, so the index -
 * and the translation that builds it - runs exactly once per (data, locale) no matter how many
 * hooks or components ask for it (the pages mirror of
 * `selectSectionIndex` in `./sections.ts`).
 *
 * Exposed (not only internal) so the referential-stability tests can assert on `recomputations()`
 * and on the shared identity of the translated objects.
 */
const selectPageIndex = createSelector(
  [(data: ApiPage[] | undefined) => data, (_data: ApiPage[] | undefined, locale: LanguageCode) => locale],
  (pages, locale): PageIndex => {
    const localized = (pages ?? []).map((page) => translateEntity(page, locale))
    const bySlug = new Map<string, TranslatedPage>()
    const linked = new Map<PageLinkLocation, TranslatedPage[]>()
    for (const page of localized) {
      bySlug.set(page.slug, page)
      for (const location of page.linked ?? []) {
        const bucket = linked.get(location)
        if (bucket) {
          bucket.push(page)
        } else {
          linked.set(location, [page])
        }
      }
    }
    return { localized, bySlug, linked }
  },
)

/**
 * Select a page by its slug.
 *
 * Plain function, not memoised: it returns a reference the index already holds, so there is
 * nothing to recompute and no reference to stabilise.
 */
function selectPageBySlug(
  data: ApiPage[] | undefined,
  locale: LanguageCode,
  slug?: string,
): TranslatedPage | undefined {
  if (slug === undefined) {
    return undefined
  }
  return selectPageIndex(data, locale).bySlug.get(slug)
}

/**
 * Select the pages linked to a layout location (e.g. `'nav'`).
 *
 * O(1) in the number of linked pages via the `linked` index instead of filtering the whole array
 * per location. Plain function for the same reason as
 * {@link selectPageBySlug}.
 */
function selectLinkedPages(
  data: ApiPage[] | undefined,
  locale: LanguageCode,
  linkLocation: PageLinkLocation,
): readonly TranslatedPage[] {
  return selectPageIndex(data, locale).linked.get(linkLocation) ?? EMPTY_TRANSLATED_PAGES
}

export { selectLinkedPages, selectPageBySlug, selectPageIndex }
