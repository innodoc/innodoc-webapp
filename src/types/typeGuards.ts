import { CONTENT_TYPES, FRAGMENT_TYPES } from '#constants'
import type { FragmentType } from '#types/entities/base'

import type { ArbitraryObject, ContentType } from './common'

/** TypeGuard for arbitrary object */
export function isArbitraryObject(obj: unknown): obj is ArbitraryObject {
  return typeof obj === 'object' && obj !== null
}

/** Type guard for ContentType */
export function isContentType(t: string): t is ContentType {
  return CONTENT_TYPES.includes(t as ContentType)
}

/** Type guard for FragmentType */
export function isFragmentType(t: string): t is FragmentType {
  return FRAGMENT_TYPES.includes(t as FragmentType)
}
