import path from 'path'

import { icons as mdiIconSet } from '@iconify-json/mdi'
import { getIcons } from '@iconify/utils/lib/icon-set/get-icons'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import ssr from 'vite-plugin-ssr/plugin'

import type { Manifest } from '@/types/api'

import scanIconNames from './scanIconNames'
import fetchManifest from './src/utils/fetchManifest'

dotenv.config()

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

async function config() {
  const manifest = await fetchManifest()

  return {
    envPrefix: 'INNODOC_', // Exposed to client
    define: {
      'import.meta.env.INNODOC_ICON_DATA': JSON.stringify(await getIconBundle(manifest)),
      'import.meta.env.INNODOC_LOCALES': JSON.stringify(manifest.languages),
    },
    plugins: [react(), ssr({ prerender: true })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }
}

export default config
