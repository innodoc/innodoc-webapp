import type { Root } from 'hast'

import type {
  CARD_TYPES,
  CONTENT_TYPES,
  COURSE_SLUG_MODES,
  PAGE_LINK_LOCACTIONS,
  SECTION_TYPES,
} from '../constants.js'

import type { ParserError } from './errors.js'

/** Arbitrary object */
type ArbitraryObject = Record<string, unknown>

/** Location in the layout where page links can appear */
type PageLinkLocation = (typeof PAGE_LINK_LOCACTIONS)[number]

/** Section type */
type SectionType = (typeof SECTION_TYPES)[number]

/** Course slug mode */
type CourseSlugMode = (typeof COURSE_SLUG_MODES)[number]

/** Content types */
type ContentType = (typeof CONTENT_TYPES)[number]

/** Content card type */
type CardType = (typeof CARD_TYPES)[number]

interface WithContentHash {
  /** CRC32 hash of content */
  hash: string
}

/** Markdown content with hash */
interface ContentWithHash extends WithContentHash {
  /** Markdown string */
  content: string
}

/** Markdown parser result */
interface HastResult {
  /** hast Root */
  root?: Root
  error?: ParserError
}

/** Markdown parser result with hash */
interface HastResultWithHash extends HastResult, WithContentHash {}

export type {
  ArbitraryObject,
  CardType,
  ContentType,
  ContentWithHash,
  CourseSlugMode,
  HastResult,
  HastResultWithHash,
  PageLinkLocation,
  SectionType,
  WithContentHash,
}
