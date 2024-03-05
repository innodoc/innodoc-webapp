import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import ssr from 'vike/plugin'
import { type InlineConfig as VitestInlineConfig } from 'vitest'
import { type UserConfigExport } from 'vitest/config'

import appConfig from '@innodoc/config'

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
    config.setupFiles = path.join(appConfig.rootDir, 'tests', 'integration', 'setup.ts')
  }

  return config
}

/* vite configuration */
function config() {
  const testMode = process.env.VITEST_MODE

  const config: UserConfigExport = {
    envPrefix: 'INNODOC_', // Exposed to client
    plugins: [react(), ssr({ prerender: false })],
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
        projectRoot: appConfig.rootDir,
      }),
    )
  }

  return config
}

export default config
