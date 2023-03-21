import fs from 'fs/promises'
import path from 'path'

import type { IconifyJSON } from '@iconify/types'
import { getIcons } from '@iconify/utils/lib/icon-set/get-icons'
import { parse as parseSvg, type RootNode } from 'svg-parser'

import scanIconNames from './scanIconNames'

const STATIC_ICONS = ['mdi:copyright']

/** Parse SVG sources into HAST */
function parse({ icons, prefix, width = 16, height = 16 }: IconifyJSON): Record<string, RootNode> {
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
      .reduce(
        (acc, icon) =>
          icon.startsWith(`${set}:`) ? [...acc, icon.substring(set.length + 1)] : acc,
        [] as string[]
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
  const iconNames = [...scannedIconName, ...STATIC_ICONS]
  const iconsPath = path.join(projectDir, 'node_modules', '@iconify-json', 'mdi', 'icons.json')
  const iconsFile = await fs.readFile(iconsPath)
  const icons = JSON.parse(iconsFile.toString()) as IconifyJSON

  // Create icon set
  const mdiIconNames = filterBySet('mdi', iconNames)
  const iconifyJson = getIcons(icons, mdiIconNames)
  if (iconifyJson === null) {
    throw new Error('Failed to get icon bundle')
  }
  return parse(iconifyJson)
}

export default getIconBundle
