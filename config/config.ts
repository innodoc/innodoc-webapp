import path from 'path'

import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { cjsInterop } from 'vite-plugin-cjs-interop'
import ssr from 'vite-plugin-ssr/plugin'
import { type InlineConfig as VitestInlineConfig } from 'vitest'
import { type UserConfigExport } from 'vitest/config'

import { imports } from '../package.json'

import buildData from './buildData'

dotenv.config()

/* Use package.json import mapping as source of truth for aliases */
const projectDir = path.resolve(__dirname, '..')
const alias = Object.fromEntries(
  Object.entries(imports).map(([key, val]) => [
    key.replace('/*', ''),
    path.join(projectDir, val.replace('/*', '')),
  ])
)

/* Configure tests */
function testConfig(testMode: string) {
  const config: VitestInlineConfig = {
    globals: true,
    include: [`tests/${testMode}/**/*.test.{ts,tsx}`],
    sequence: { hooks: 'stack' },
  }

  if (testMode === 'integration') {
    config.environment = 'jsdom'
    config.setupFiles = path.resolve(__dirname, '..', 'tests', 'integration', 'setup.ts')
  }

  return config
}

/* vite configuration */
async function config() {
  const testMode = process.env.VITEST_MODE

  if (testMode !== 'unit') {
    await buildData()
  }

  const config: UserConfigExport = {
    envPrefix: 'INNODOC_', // Exposed to client
    plugins: [
      cjsInterop({
        // unwrap default imports from CJS dependencies during SSR
        dependencies: ['@emotion/*'],
      }),
      react(),
      ssr({ prerender: true }),
    ],
    resolve: { alias },
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
