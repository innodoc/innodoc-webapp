import type { FRAGMENT_TYPES } from '@innodoc/constants'

/** Content fragment type */
type FragmentType = (typeof FRAGMENT_TYPES)[number]

export type { FragmentType }
