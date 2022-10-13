import path from 'path'

import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import type { UserConfigExport } from 'vite'
import ssr from 'vite-plugin-ssr/plugin'
import type { InlineConfig as VitestInlineConfig } from 'vitest'

import buildData from './buildData'

dotenv.config()

/* Configure tests */
function testConfig() {
  const testMode = process.env.VITEST_MODE ?? 'unit'
  if (!['integration', 'unit'].includes(testMode)) {
    throw new Error('VITEST_MODE must be one of integration or unit.')
  }

  const config: VitestInlineConfig = {
    globals: true,
    include: [`tests/${testMode}/**/*.test.{ts,tsx}`],
  }

  if (testMode === 'integration') {
    config.environment = 'happy-dom'
    config.setupFiles = path.resolve(__dirname, '..', 'tests', 'integration', 'setup.ts')
  }

  return config
}

/* vite configuration */
async function config(): Promise<UserConfigExport> {
  await buildData()

  return {
    envPrefix: 'INNODOC_', // Exposed to client
    plugins: [react(), ssr({ prerender: true })],
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
    test: testConfig(),
  }
}

export default config
