import { getIcons } from '@iconify/utils/lib/icon-set/get-icons'
import type { IconifyJSON } from '@iconify/types'

import parseSvg from './parse-svg.js'
import scanIconNames from './scan-icon-names.js'

const STATIC_ICONS = ['mdi:copyright']

/** Parse SVG sources into HAST */
function parse({ icons, prefix, width = 24, height = 24 }: IconifyJSON) {
  const parsedIcons: Record<string, string> = {}

  for (const [name, { body }] of Object.entries(icons)) {
    parsedIcons[`${prefix}:${name}`] = parseSvg(`<svg viewBox='0 0 ${String(width)} ${String(height)}'>${body}</svg>`)
  }

  return parsedIcons
}

/** Filter by icon set */
function filterBySet(setName: string, iconNames: string[]) {
  const filteredIconNames = new Set<string>()

  for (const iconName of iconNames) {
    if (iconName.startsWith(`${setName}:`)) {
      filteredIconNames.add(iconName.slice(Math.max(0, setName.length + 1)))
    }
  }

  return [...filteredIconNames]
}

/** Create icon bundle from manifest pages and static info from source code. */
async function getIconBundle(paths: string[]) {
  // Icon names from source code
  const scannedIconName = await scanIconNames(paths)

  // Read all icons
  const iconifyJsonAll = await import('@iconify-json/mdi/icons.json', { with: { type: 'json' } })

  // Create icon subset
  const mdiIconNames = filterBySet('mdi', [...scannedIconName, ...STATIC_ICONS])

  const iconifyJson = getIcons(iconifyJsonAll.default, mdiIconNames)
  if (iconifyJson === null) {
    throw new Error('Failed to get icon bundle')
  }

  return parse(iconifyJson)
}

export default getIconBundle
