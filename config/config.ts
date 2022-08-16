import path from 'path'

import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import ssr from 'vite-plugin-ssr/plugin'

import fetchManifest from '../src/utils/fetchManifest'

import getIconBundle from './getIconBundle'

dotenv.config()

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
        '@': path.resolve(__dirname, '..', 'src'),
      },
    },
  }
}

export default config
