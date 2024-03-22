import typescriptEslint from 'typescript-eslint'

import innodocConfig from '@innodoc/eslint-config'

export default typescriptEslint.config({
  files: ['src/migrations/*.ts'],
  extends: innodocConfig,
  rules: {
    'filenames/match-exported': 'off',
    'filenames/match-regex': 'off',
  },
})
