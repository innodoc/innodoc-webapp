import path from 'path'

import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import type { UserConfigExport } from 'vite'
import ssr from 'vite-plugin-ssr/plugin'

import buildData from './buildData'

dotenv.config()

async function config(): Promise<UserConfigExport> {
  await buildData()

  return {
    envPrefix: 'INNODOC_', // Exposed to client
    plugins: [
      react(),
      ssr({
        prerender: true,
      }),
    ],
    resolve: {
      alias: {
        '@/test-utils': path.resolve(__dirname, '..', 'tests', 'integration', 'utils.tsx'),
        '@': path.resolve(__dirname, '..', 'src'),
      },
    },
    ssr: {
      noExternal: [
        '@reduxjs/toolkit', // otherwise can't be loaded on prerendering
      ],
    },
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: path.resolve(__dirname, '..', 'tests', 'integration', 'setup.ts'),
    },
  }
}

export default config
