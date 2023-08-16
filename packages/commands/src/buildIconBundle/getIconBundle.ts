import { getIcons } from '@iconify/utils/lib/icon-set/get-icons'
import type { IconifyJSON } from '@iconify/types'

// import { parse as parseSvg, type RootNode } from 'svg-parser'
import parseSvg from './parseSvg'
import scanIconNames from './scanIconNames'

const STATIC_ICONS = ['mdi:copyright']

/** Parse SVG sources into HAST */
function parse({ icons, prefix, width = 24, height = 24 }: IconifyJSON) {
  return Object.fromEntries(
    Object.entries(icons).map(([name, { body }]) => [
      `${prefix}:${name}`,
      parseSvg(`<svg viewBox='0 0 ${width} ${height}'>${body}</svg>`),
    ])
  )
}

/** Filter by icon set */
function filterBySet(set: string, iconNames: string[]) {
  return (
    iconNames
      // Filter for and strip 'mdi:...'
      .reduce<string[]>(
        (acc, icon) =>
          icon.startsWith(`${set}:`) ? [...acc, icon.substring(set.length + 1)] : acc,
        []
      )
      // Unique
      .filter((val, idx, self) => self.indexOf(val) === idx)
  )
}

/**
 * Create icon bundle from manifest pages and static info from source code.
 */
async function getIconBundle(projectDir: string) {
  // Icon names from source code
  const scannedIconName = await scanIconNames(projectDir)

  // Read all icons
  const iconifyJsonAll = await import('@iconify-json/mdi/icons.json', { assert: { type: 'json' } })

  // Create icon subset
  const mdiIconNames = filterBySet('mdi', [...scannedIconName, ...STATIC_ICONS])

  const iconifyJson = getIcons(iconifyJsonAll.default, mdiIconNames)
  if (iconifyJson === null) {
    throw new Error('Failed to get icon bundle')
  }
  return parse(iconifyJson)
}

export default getIconBundle
