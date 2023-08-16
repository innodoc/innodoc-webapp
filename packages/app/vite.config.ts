import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import ssr from 'vite-plugin-ssr/plugin'
import { type InlineConfig as VitestInlineConfig } from 'vitest'
import { type UserConfigExport } from 'vitest/config'

import dotEnv from '@innodoc/utils/dot-env'

// import pkg from './package.json' assert { type: 'json' }

const projectDir = path.resolve(__dirname, '..', '..')

/* Use package.json import mapping as source of truth for aliases */
// const alias = Object.fromEntries(
//   Object.entries(pkg.imports).map(([key, val]) => [
//     key.replace('/*', ''),
//     path.join(projectDir, val.replace('/*', '')),
//   ])
// )

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
    config.setupFiles = path.join(projectDir, 'tests', 'integration', 'setup.ts')
  }

  return config
}

/* vite configuration */
function config() {
  dotEnv(projectDir)

  const testMode = process.env.VITEST_MODE

  const config: UserConfigExport = {
    envPrefix: 'INNODOC_', // Exposed to client
    plugins: [react(), ssr({ prerender: false })],
    // resolve: { alias },
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
    config.plugins?.push(
      visualizer({
        gzipSize: true,
        projectRoot: projectDir,
      })
    )
  }

  return config
}

export default config
