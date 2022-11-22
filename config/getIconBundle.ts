import fs from 'fs/promises'
import { resolve } from 'path'

import type { IconifyJSON } from '@iconify/types'
import { getIcons } from '@iconify/utils/lib/icon-set/get-icons'
import { parse as parseSvg, type RootNode } from 'svg-parser'

import type { ApiManifest } from '#types/api'

import scanIconNames from './scanIconNames'

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

/** Parse file data from content */
async function getFileIconData(iconNames: string[]): Promise<Record<string, RootNode>> {
  const contentRoot = process.env.INNODOC_CONTENT_ROOT
  if (contentRoot === undefined)
    throw new Error('You need to set the env variable INNODOC_CONTENT_ROOT.')

  return Object.fromEntries(
    await Promise.all(
      iconNames.map(async (iconName): Promise<[string, RootNode]> => {
        const res = await fetch(`${contentRoot}_static/${iconName}`)
        if (!res.ok) throw new Error(`Failed to fetch SVG icon ${iconName}`)
        return [`file:${iconName}`, parseSvg(await res.text())]
      })
    )
  )
}

/**
 * Create icon bundle from manifest pages and static info from source code.
 */
async function getIconBundle(manifest: ApiManifest) {
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

  const iconNamesCombined = [...iconNamesSourcecode, ...iconNamesManifestPages]

  // Read all icons
  const iconsPath = resolve(__dirname, '..', 'node_modules', '@iconify-json', 'mdi', 'icons.json')
  const iconsFile = await fs.readFile(iconsPath)
  const icons = JSON.parse(iconsFile.toString()) as IconifyJSON

  // Create icon set
  const mdiIconNames = filterBySet('mdi', iconNamesCombined)
  const iconifyJson = getIcons(icons, mdiIconNames)
  if (iconifyJson === null) {
    throw new Error('Failed to get icon bundle')
  }
  const parsedMdiIcons = parse(iconifyJson)

  // Get file icons from content
  const iconFilenames = filterBySet('file', iconNamesCombined)
  const fileIcons = await getFileIconData(iconFilenames)

  return { ...parsedMdiIcons, ...fileIcons }
}

export default getIconBundle
