import { defineConfig, mergeConfig } from 'vitest/config'

import configBase from './vitest.config.base.js'

export default mergeConfig(
  configBase,
  defineConfig({
    test: {
      name: 'rtl',
      environment: 'jsdom',
      include: ['tests/**/*.test.ts?(x)'],
      mockReset: true,
      sequence: { hooks: 'stack' },
      setupFiles: '@innodoc/rtl/setup',
      unstubEnvs: true,
    },
  }),
)
