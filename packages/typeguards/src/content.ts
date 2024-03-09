import { CONTENT_TYPES } from '@innodoc/constants'
import type { ContentType, ContentWithHash, WithContentHash } from '@innodoc/types/common'
import type { ApiPage } from '@innodoc/types/entities'

import { isArbitraryObject } from './common'

/** Type guard for `ContentType` */
function isContentType(t: string): t is ContentType {
  return CONTENT_TYPES.includes(t as ContentType)
}

/** Type guard for `ApiPage` */
function isApiPage(thing: unknown): thing is ApiPage {
  return isArbitraryObject(thing) && typeof thing.slug === 'string'
}

/** Type guard for `WithContentHash` */
function isWithContentHash(object: unknown): object is WithContentHash {
  return isArbitraryObject(object) && typeof object.hash === 'string' && object.hash.length === 8
}

/** Type guard for `ContentWithHash` */
function isContentWithHash(object: unknown): object is ContentWithHash {
  return isWithContentHash(object) && typeof (object as ContentWithHash).content === 'string'
}

export { isApiPage, isContentType, isContentWithHash, isWithContentHash }
