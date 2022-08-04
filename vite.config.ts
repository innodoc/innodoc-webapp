import path from 'path'

import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import ssr from 'vite-plugin-ssr/plugin'

import fetchManifest from './src/utils/fetchManifest'

dotenv.config()

async function config() {
  const contentRoot = process.env.INNODOC_CONTENT_ROOT
  if (contentRoot === undefined) {
    throw new Error('You need to set the env variable INNODOC_CONTENT_ROOT.')
  }

  const manifest = await fetchManifest(contentRoot)

  return {
    envPrefix: 'INNODOC_',
    define: {
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
