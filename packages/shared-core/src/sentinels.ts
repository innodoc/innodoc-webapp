import type { SectionWithChildren, TranslatedPage, TranslatedSection } from '#types'

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
