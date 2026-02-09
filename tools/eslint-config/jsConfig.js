import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

import rules from './rules.js'

const jsConfig = typescriptEslint.config({
  files: ['*.js'],
  extends: [typescriptEslint.configs.disableTypeChecked],
  plugins: {
    import: eslintPluginImport,
    prettier: eslintPluginPrettier,
    'simple-import-sort': eslintPluginSimpleImportSort,
  },
  languageOptions: {
    globals: {
      ...globals.es2021,
      ...globals.node,
    },
  },
  settings: {
    'import/extensions': ['.js'],
    'import/resolver': {
      typescript: false,
      node: true,
    },
  },
  rules: {
    ...eslintPluginImport.configs.typescript.rules,
    ...eslintPluginPrettier.configs.recommended.rules,

    ...rules.eslint,
    ...rules.import,
    ...rules.prettier,
    ...rules.simpleImportSort,
    ...rules.unicorn,
  },
})

export default jsConfig
