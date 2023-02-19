import type { PAGE_LINK_LOCACTIONS, SECTION_TYPES } from '#constants'

/** Location in the layout where page links can appear */
export type PageLinkLocation = typeof PAGE_LINK_LOCACTIONS[number]

/** Section type */
export type SectionType = typeof SECTION_TYPES[number]
