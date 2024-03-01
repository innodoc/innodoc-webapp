import ISO6391, { type LanguageCode } from 'iso-639-1'

import { CONTENT_TYPES, FRAGMENT_TYPES } from '@innodoc/constants'
import type {
  ArbitraryObject,
  ContentType,
  ContentWithHash,
  ParserError,
  WithContentHash,
} from '@innodoc/types/common'
import type { FragmentType } from '@innodoc/types/entities'

const languageCodes = ISO6391.getAllCodes()

/** Type guard for arbitrary object */
function isArbitraryObject(obj: unknown): obj is ArbitraryObject {
  return typeof obj === 'object' && obj !== null
}

/** Type guard for callable */
function isCallable<T extends (...args: unknown[]) => unknown>(obj: unknown): obj is T {
  return (isArbitraryObject(obj) && obj instanceof Function) || typeof obj === 'function'
}

/** Type guard for error object */
function isParserError(obj: unknown): obj is ParserError {
  return (
    isArbitraryObject(obj) &&
    typeof obj.reason === 'string' &&
    typeof obj.line === 'number' &&
    typeof obj.column === 'number' &&
    typeof obj.source === 'string' &&
    typeof obj.ruleId === 'string'
  )
}

/** Type guard for `ContentType` */
function isContentType(t: string): t is ContentType {
  return CONTENT_TYPES.includes(t as ContentType)
}

/** Type guard for `FragmentType` */
function isFragmentType(t: string): t is FragmentType {
  return FRAGMENT_TYPES.includes(t as FragmentType)
}

/** Type guard for `LanguageCode` */
function isLanguageCode(t: unknown): t is LanguageCode {
  return typeof t === 'string' && languageCodes.includes(t as LanguageCode)
}

/** Type guard for `WithContentHash` */
function isWithContentHash(obj: unknown): obj is WithContentHash {
  return isArbitraryObject(obj) && typeof obj.hash === 'string' && obj.hash.length === 8
}

/** Type guard for `ContentWithHash` */
function isContentWithHash(obj: unknown): obj is ContentWithHash {
  return isWithContentHash(obj) && typeof (obj as ContentWithHash).content === 'string'
}

export {
  isArbitraryObject,
  isCallable,
  isContentType,
  isContentWithHash,
  isFragmentType,
  isLanguageCode,
  isParserError,
  isWithContentHash,
}
