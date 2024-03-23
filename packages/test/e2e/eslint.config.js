import playwright from 'eslint-plugin-playwright'

import innodocConfig from '@innodoc/eslint-config'

export default [
  ...innodocConfig,
  playwright.configs['flat/recommended'],
  {
    files: ['playwright.config.ts'],
    extends: innodocConfig,
    rules: {
      'filenames/match-exported': 'off',
      'filenames/match-regex': 'off',
    },
  },
]
