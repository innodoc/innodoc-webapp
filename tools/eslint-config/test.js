import vitest from '@vitest/eslint-plugin'
import { defineConfig } from 'eslint/config'
import jestDom from 'eslint-plugin-jest-dom'
import testingLibrary from 'eslint-plugin-testing-library'

const config = defineConfig({
  name: 'innodoc/test',
  files: ['**/*.test.{ts,tsx}'],
  extends: [vitest.configs.recommended, jestDom.configs['flat/recommended'], testingLibrary.configs['flat/react']],
  rules: {
    // Enforce flat test functions (1 describe allowed)
    'vitest/max-nested-describe': ['error', { max: 0 }],
  },
  settings: {
    // Custom utility package
    'testing-library/utils-module': '@innodoc/rtl',
  },
})

export default config
