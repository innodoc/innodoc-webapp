import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import ssr from 'vike/plugin'
import type { InlineConfig as VitestInlineConfig } from 'vitest'
import type { UserConfigExport } from 'vitest/config'

import packageJson from './package.json' with { type: 'json' }

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '..', '..')

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
    config.setupFiles = path.join(rootDir, 'tests', 'integration', 'setup.ts')
  }

  return config
}

/* vite configuration */
function config() {
  const testMode = process.env.VITEST_MODE

  const config: UserConfigExport = {
    envDir: rootDir,
    envPrefix: 'INNODOC_', // Exposed to client
    plugins: [react(), ssr({ prerender: false })],
    optimizeDeps: {
      // exclude local monorepo deps
      exclude: Object.keys(packageJson.dependencies).filter((dep) => dep.startsWith('@innodoc/')),
    },
    resolve: {
      // use "vite" key in exports before "node"
      conditions: ['vite'],
    },
    ssr: {
      noExternal: [
        '@reduxjs/toolkit', // otherwise can't be loaded on prerendering
        'react-helmet-async', // staylor/react-helmet-async#208
      ],
    },
  }

  if (testMode && ['integration', 'unit'].includes(testMode)) {
    config.test = testConfig(testMode)
  }

  if (process.env.VISUALIZE_BUNDLE === 'true') {
    config.plugins?.push(
      visualizer({
        gzipSize: true,
        projectRoot: dirname,
      }),
    )
  }

  return config
}

export default config
