import iconBundle from '#iconBundle' assert { type: 'json' }

import type { IconName } from './types'

const iconNames = Object.keys(iconBundle)

/** Type guard for `Locale` */
function isIconName(name: unknown): name is IconName {
  return typeof name === 'string' && iconNames.includes(name)
}

export { isIconName }
