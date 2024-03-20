import { defineConfig, mergeConfig } from 'vitest/config'

import configBase from './vitest.config.base.js'

export default mergeConfig(
  configBase,
  defineConfig({
    test: {
      name: 'integration',
      environment: 'jsdom',
      include: ['tests/integration/**/*.test.ts?(x)'],
    },
  }),
)
