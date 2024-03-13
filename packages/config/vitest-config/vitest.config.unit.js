import { defineConfig, mergeConfig } from 'vitest/config'

import configBase from './vitest.config.base.js'

export default mergeConfig(
  configBase,
  defineConfig({
    test: {
      environment: 'node',
      include: ['tests/unit/**/*.test.ts'],
      name: 'unit',
    },
  }),
)
