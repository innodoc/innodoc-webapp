import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

import innodocConfig from '@innodoc/eslint-config'

export default typescriptEslint.config({
  files: ['src/**/*.ts'],
  extends: innodocConfig,
  languageOptions: {
    globals: globals.node,
  },
})
