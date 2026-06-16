import { defineConfig, mergeConfig } from 'vitest/config'
import configBase from './vitest.config.base'

export default mergeConfig(
  configBase,
  defineConfig({
    test: {
      name: 'unit',
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  }),
)
