import { isArbitraryObject } from '@innodoc/typeguards/common'
import type { TranslatableString } from '@innodoc/types/common'

import { validateTranslatableString } from './common'

/** Type guard for `TranslatableString` */
function isTranslatableString(thing: unknown): thing is TranslatableString {
  return isArbitraryObject(thing) && validateTranslatableString(thing)
}

export { isTranslatableString }
