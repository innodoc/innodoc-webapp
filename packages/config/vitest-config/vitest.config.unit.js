import { defineConfig, mergeConfig } from 'vitest/config'

import configBase from './vitest.config.base.js'

export default mergeConfig(
  configBase,
  defineConfig({
    test: {
      name: 'unit',
      environment: 'node',
      include: ['tests/**/*.test.ts'],
      exclude: ['tests/integration/**/*.test.ts?(x)'],
    },
  }),
)
