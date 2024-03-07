import type { Root } from 'hast'
import type { z } from 'zod'

import type {
  CONTENT_TYPES,
  COURSE_SLUG_MODES,
  PAGE_LINK_LOCACTIONS,
  SECTION_TYPES,
} from '@innodoc/constants'
import type { translatableString } from '@innodoc/schema/common'

/** Arbitrary object */
type ArbitraryObject = Record<string, unknown>

/** Field that holds a string in different languages */
type TranslatableString = z.infer<typeof translatableString>

/** Location in the layout where page links can appear */
type PageLinkLocation = (typeof PAGE_LINK_LOCACTIONS)[number]

/** Section type */
type SectionType = (typeof SECTION_TYPES)[number]

/** Course slug mode */
type CourseSlugMode = (typeof COURSE_SLUG_MODES)[number]

/** Content types */
type ContentType = (typeof CONTENT_TYPES)[number]

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

/** Markdown parser error */
interface ParserError {
  column: number
  line: number
  reason: string
  ruleId: string
  source: string
}

export type {
  ArbitraryObject,
  ContentType,
  ContentWithHash,
  CourseSlugMode,
  HastResult,
  HastResultWithHash,
  PageLinkLocation,
  ParserError,
  SectionType,
  TranslatableString,
  WithContentHash,
}
