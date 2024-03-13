import globals from 'globals'

import innodocConfig from '@innodoc/eslint-config'

/** @type {import("eslint").Linter.FlatConfig} */
const config = [
  ...innodocConfig,

  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
]

export default config
