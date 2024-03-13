import globals from 'globals'

import innodocConfig from '@innodoc/eslint-config'

/** @type {import("eslint").Linter.FlatConfig} */
const config = [
  ...innodocConfig,

  {
    files: ['src/renderer/client/*.ts'],
    languageOptions: {
      globals: globals.browser,
    },
  },

  {
    files: ['src/renderer/server/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Filename rule exceptions
  {
    files: [
      'vite.config.ts',
      // vike files
      'src/*/**/\\+*.ts',
    ],
    rules: {
      'filenames/match-exported': 'off',
      'filenames/match-regex': 'off',
    },
  },
]

export default config
