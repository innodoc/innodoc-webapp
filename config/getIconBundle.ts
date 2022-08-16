import { icons as mdiIconSet } from '@iconify-json/mdi'
import { getIcons } from '@iconify/utils/lib/icon-set/get-icons'

import type { Manifest } from '@/types/api'

import scanIconNames from './scanIconNames'

/**
 * Create icon bundle from manifest pages and static info from source code.
 */
async function getIconBundle(manifest: Manifest) {
  // Icon names from source code
  const iconNamesSourcecode = await scanIconNames()

  // Icon names from manifest
  const iconNamesManifestPages =
    manifest.pages !== undefined
      ? manifest.pages.reduce(
          (acc, p) => (p.icon !== undefined ? [...acc, p.icon] : acc),
          [] as string[]
        )
      : []

  // Icon name manifest logo
  const iconNameManifestLogo = manifest.logo !== undefined ? [manifest.logo] : []

  const iconNamesCombined = [
    ...iconNamesSourcecode,
    ...iconNamesManifestPages,
    ...iconNameManifestLogo,
  ]

  const mdiIconNames = iconNamesCombined
    // Filter for and strip 'mdi:...'
    .reduce(
      (acc, icon) => (icon.startsWith('mdi:') ? [...acc, icon.replace(/^mdi:/, '')] : acc),
      [] as string[]
    )
    // Unique
    .filter((val, idx, self) => self.indexOf(val) === idx)

  return getIcons(mdiIconSet, mdiIconNames)
}

export default getIconBundle
