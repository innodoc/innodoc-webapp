import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

import innodocConfig from '@innodoc/eslint-config'

export default typescriptEslint.config(
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
)
