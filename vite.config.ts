import path from 'path'

import { icons as mdiIconSet } from '@iconify-json/mdi'
import { getIcons } from '@iconify/utils/lib/icon-set/get-icons'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import ssr from 'vite-plugin-ssr/plugin'

import fetchManifest from './src/utils/fetchManifest'

dotenv.config()

const icons = [
  'account-circle',
  'chevron-left',
  'information-outline',
  'login',
  'menu',
  'school',
  'weather-night',
  'weather-sunny',
]

async function config() {
  const contentRoot = process.env.INNODOC_CONTENT_ROOT
  if (contentRoot === undefined) {
    throw new Error('You need to set the env variable INNODOC_CONTENT_ROOT.')
  }

  const manifest = await fetchManifest(contentRoot)

  const iconBundle = getIcons(mdiIconSet, icons)

  return {
    envPrefix: 'INNODOC_', // Exposed to client
    define: {
      'import.meta.env.INNODOC_ICON_DATA': JSON.stringify(iconBundle),
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
