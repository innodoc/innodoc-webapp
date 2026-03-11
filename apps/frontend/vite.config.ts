import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import ssr from 'vike/plugin'
import { defineConfig } from 'vitest/config'
import type { UserConfig } from 'vite'

import packageJson from './package.json' with { type: 'json' }

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '..', '..')

/* Configure tests */
function testConfig(testMode: string) {
  const config: UserConfig['test'] = {
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

function baseConfig(): UserConfig {
  // exclude local monorepo deps
  const localDeps = Object.keys(packageJson.dependencies).filter((dep) => dep.startsWith('@innodoc/'))

  return {
    envDir: rootDir,
    envPrefix: 'INNODOC_', // Exposed to client
    plugins: [react(), ssr({ prerender: false })],
    optimizeDeps: { exclude: localDeps },
    ssr: {
      noExternal: [
        '@reduxjs/toolkit', // otherwise can't be loaded on prerendering
        'react-helmet-async', // staylor/react-helmet-async#208
      ],
    },
  }
}

/* vite configuration */
const config = defineConfig(() => {
  const testMode = process.env.VITEST_MODE

  const viteConfig = baseConfig()

  if (testMode && ['integration', 'unit'].includes(testMode)) {
    viteConfig.test = testConfig(testMode)
  }

  if (process.env.VISUALIZE_BUNDLE === 'true') {
    viteConfig.plugins?.push(
      visualizer({
        gzipSize: true,
        projectRoot: dirname,
      }),
    )
  }

  return viteConfig
})

export default config
