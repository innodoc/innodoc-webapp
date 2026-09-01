import { CONTENT_TYPES } from '#constants'
// oxlint-disable-next-line unicorn/prefer-export-from -- used locally and re-exported
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

/**
 * Records whose `validateTranslatableString` verdict was positive, keyed by object identity.
 *
 * The records this guard is asked about are immutable state objects (JSON parsed at the API
 * boundary, never mutated afterwards), so a positive verdict cannot go stale, and each entry is
 * collected with its record - no eviction policy needed. Only positive verdicts are cached:
 * the full `isLocale()`-per-key walk still runs on first sight, which is where a payload is
 * genuinely untrusted, and every later pass is one `WeakSet.has()`.
 */
const validatedTranslatableStrings = new WeakSet<object>()

/** Type guard for `TranslatableString` */
function isTranslatableString(thing: unknown): thing is TranslatableString {
  if (!isArbitraryObject(thing)) {
    return false
  }
  if (validatedTranslatableStrings.has(thing)) {
    return true
  }
  if (validateTranslatableString(thing)) {
    validatedTranslatableStrings.add(thing)
    return true
  }
  return false
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
