import { CONTENT_TYPES } from '#constants'
import { validateTranslatableString } from '#schemas/common'
import type { ApiPage, ContentType, ContentWithHash, TranslatableString, WithContentHash } from '#types'

import { isArbitraryObject } from './common.js'

/** Type guard for `ContentType` */
function isContentType(t: unknown): t is ContentType {
  return typeof t === 'string' && CONTENT_TYPES.includes(t as ContentType)
}

/** Type guard for `ApiPage` */
function isApiPage(thing: unknown): thing is ApiPage {
  return isArbitraryObject(thing) && typeof thing.slug === 'string'
}

/** Type guard for `TranslatableString` */
function isTranslatableString(thing: unknown): thing is TranslatableString {
  return isArbitraryObject(thing) && validateTranslatableString(thing)
}

/** Type guard for `WithContentHash` */
function isWithContentHash(object: unknown): object is WithContentHash {
  return isArbitraryObject(object) && typeof object.hash === 'string' && object.hash.length === 8
}

/** Type guard for `ContentWithHash` */
function isContentWithHash(object: unknown): object is ContentWithHash {
  return isWithContentHash(object) && typeof (object as ContentWithHash).content === 'string'
}

export {
  isApiPage,
  isContentType,
  isContentWithHash,
  isTranslatableString,
  isWithContentHash,
  validateTranslatableString,
}
