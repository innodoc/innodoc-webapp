import type { IconifyJSON } from '@iconify/types'
import { getIcons } from '@iconify/utils/lib/icon-set/get-icons'
import { ICON_NAMES } from '@innodoc/shared-core/icons'
import parseSvg from './parse-svg.js'

/** Parse SVG sources into HAST */
function parse({ icons, prefix, width = 24, height = 24 }: IconifyJSON) {
  const parsedIcons: Record<string, string> = {}

  for (const [name, { body }] of Object.entries(icons)) {
    parsedIcons[`${prefix}:${name}`] = parseSvg(`<svg viewBox='0 0 ${String(width)} ${String(height)}'>${body}</svg>`)
  }

  return parsedIcons
}

/** Filter by icon set */
function filterBySet(setName: string, iconNames: readonly string[]) {
  const filteredIconNames = new Set<string>()

  for (const iconName of iconNames) {
    if (iconName.startsWith(`${setName}:`)) {
      filteredIconNames.add(iconName.slice(Math.max(0, setName.length + 1)))
    }
  }

  return [...filteredIconNames]
}

/** Create icon bundle from the `ICON_NAMES` manifest. */
async function getIconBundle() {
  // Read all icons
  const iconifyJsonAll = await import('@iconify-json/mdi/icons.json', { with: { type: 'json' } })

  // Create icon subset
  const mdiIconNames = filterBySet('mdi', ICON_NAMES)
  const iconifyJson = getIcons(iconifyJsonAll.default, mdiIconNames)
  if (iconifyJson === null) {
    throw new Error('Failed to get icon bundle')
  }

  // Fail fast on manifest entries that don't exist in the icon set (e.g. typos)
  const missing = mdiIconNames.filter((name) => !(name in iconifyJson.icons))
  if (missing.length > 0) {
    throw new Error(`Icons not found in icon set: ${missing.join(', ')}`)
  }

  return parse(iconifyJson)
}

export default getIconBundle
