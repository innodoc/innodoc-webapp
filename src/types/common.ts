import type { LanguageCode } from 'iso-639-1'

import type { PAGE_LINK_LOCACTIONS, SECTION_TYPES } from '#constants'

/** String that is translated to different languages */
export type LocalizedString = Record<LanguageCode, string>

/** Location in the layout where page links can appear */
export type PageLinkLocation = typeof PAGE_LINK_LOCACTIONS[number]

/** Section type */
export type SectionType = typeof SECTION_TYPES[number]

// TODO: remove
export type AttrObj = Record<string, string>

type TYear = `${number}${number}${number}${number}`
type TMonth = `${number}${number}`
type TDay = `${number}${number}`
type THours = `${number}${number}`
type TMinutes = `${number}${number}`
type TSeconds = `${number}${number}`
type TMilliseconds = `${number}${number}${number}`
type TDateISODate = `${TYear}-${TMonth}-${TDay}`
type TDateISOTime = `${THours}:${TMinutes}:${TSeconds}.${TMilliseconds}`

/*
 * ISO 8601 format like `2021-01-08T14:42:34.678Z`, taken from
 * https://gist.github.com/MrChocolatine/367fb2a35d02f6175cc8ccb3d3a20054
 */
export type DateISO8601 = `${TDateISODate}T${TDateISOTime}Z`
