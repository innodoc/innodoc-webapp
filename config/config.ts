import path from 'path'

import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import ssr from 'vite-plugin-ssr/plugin'
import { type InlineConfig as VitestInlineConfig } from 'vitest'
import { type UserConfigExport } from 'vitest/config'

import buildData from './buildData'

dotenv.config()

/* Configure tests */
function testConfig(testMode: string) {
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
async function config() {
  const testMode = process.env.VITEST_MODE

  if (testMode !== 'unit') {
    await buildData() // Don't require running web server for unit tests
  }

  const config: UserConfigExport = {
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
  }

  if (testMode && ['integration', 'unit'].includes(testMode)) {
    config.test = testConfig(testMode)
  }

  return config
}

export default config
