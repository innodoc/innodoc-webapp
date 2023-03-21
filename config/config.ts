import path from 'path'

import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { cjsInterop } from 'vite-plugin-cjs-interop'
import ssr from 'vite-plugin-ssr/plugin'
import { type InlineConfig as VitestInlineConfig } from 'vitest'
import { type UserConfigExport } from 'vitest/config'

import { imports } from '../package.json'
import loadDotEnv from '../src/utils/loadDotEnv'

import buildIcons from './buildIcons/buildIcons'

const projectDir = path.resolve(__dirname, '..')

/* Use package.json import mapping as source of truth for aliases */
const aliasPackageJson = Object.fromEntries(
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
    mockReset: true,
    unstubEnvs: true,
  }

  if (testMode === 'integration') {
    config.environment = 'jsdom'
    config.setupFiles = path.resolve(__dirname, '..', 'tests', 'integration', 'setup.ts')
  }

  return config
}

/* vite configuration */
async function config() {
  loadDotEnv(projectDir)

  const testMode = process.env.VITEST_MODE

  if (testMode !== 'unit') {
    await buildIcons(projectDir)
  }

  const config: UserConfigExport = {
    envPrefix: 'INNODOC_', // Exposed to client
    plugins: [
      cjsInterop({
        // unwrap default imports from CJS dependencies during SSR
        dependencies: ['@emotion/*'],
      }),
      react(),
      ssr({ prerender: false }),
    ],
    resolve: {
      alias: {
        ...aliasPackageJson,
        // Force index.js. index.dom.js wouldn't work in web worker
        'decode-named-character-reference': path.join(
          projectDir,
          'node_modules',
          'decode-named-character-reference',
          'index.js'
        ),
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

  if (process.env.VISUALIZE_BUNDLE === 'true') {
    config.plugins?.push(visualizer())
  }

  return config
}

export default config
