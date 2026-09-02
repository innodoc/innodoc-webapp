import type { ContentWithHash, SectionWithChildren, TranslatedPage, TranslatedSection } from '#types'

/** Hash the {@link NOT_YET_TRANSLATED_CONTENT} sentinel carries. Never a real CRC32: it must
 *  collide with none of the hashes the client computes for served content. */
export const NOT_YET_TRANSLATED_HASH = 'not-yet-translated'

/**
 * Content the server puts in the content-query cache when a course declares the route's locale
 * but the page or section has no content row in it: the app renders it as the localized
 * "not yet translated" state instead of an error, and the client's own 404 for the same URL
 * renders the same state (the store keeps one meaning for one situation).
 */
export const NOT_YET_TRANSLATED_CONTENT: Readonly<ContentWithHash> = Object.freeze({
  content: '',
  hash: NOT_YET_TRANSLATED_HASH,
})

/** Stable sentinels for "no data yet / not applicable". Frozen: a write throws in strict mode
 *  instead of corrupting every consumer at once. Never replace with a per-call `[]`.
 *
 *  Returning a fresh `[]` from a `selectFromResult` defeats RTK Query's `shallowEqual` gate, so
 *  every skipped/loading consumer re-renders with the store.
 *
 *  They live in `@innodoc/shared-core` because the consumers are the module-scoped selectors in
 *  `@innodoc/shared-store` (which may not import from `ui-*`) and the `ui-*` store hooks alike. */
export const EMPTY_TRANSLATED_SECTIONS: readonly TranslatedSection[] = Object.freeze([])
export const EMPTY_SECTION_TREE: readonly SectionWithChildren[] = Object.freeze([])
export const EMPTY_TRANSLATED_PAGES: readonly TranslatedPage[] = Object.freeze([])
