import eslintPluginDeprecation from 'eslint-plugin-deprecation'
import eslintPluginFilenames from 'eslint-plugin-filenames'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginPromise from 'eslint-plugin-promise'
import eslintPluginRegexp from 'eslint-plugin-regexp'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

import parserOptions from './parserOptions.js'
import rules from './rules.js'

const tsConfig = typescriptEslint.config(
  {
    files: ['**/*.ts'],
    plugins: {
      deprecation: eslintPluginDeprecation,
      filenames: eslintPluginFilenames,
      import: eslintPluginImport,
      prettier: eslintPluginPrettier,
      promise: eslintPluginPromise,
      regexp: eslintPluginRegexp,
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
    languageOptions: {
      globals: {
        ...globals.es2021,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ...parserOptions,
      },
    },
    settings: {
      'import/extensions': ['.ts'],
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          ...parserOptions,
        },
      },
    },
    rules: {
      // Plugin configs
      ...eslintPluginDeprecation.configs.recommended.rules,
      ...eslintPluginImport.configs.typescript.rules,
      ...eslintPluginPromise.configs.recommended.rules,
      ...eslintPluginPrettier.configs.recommended.rules,

      // Custom rules
      ...rules.eslint,
      ...rules.filenames,
      ...rules.import,
      ...rules.prettier,
      ...rules.regexp,
      ...rules.simpleImportSort,
      ...rules.typescript,
      ...rules.unicorn,
    },
  },

  // Exclude declaration files/vitest config from file naming rules
  {
    files: ['**/*.d.ts', 'vitest.config*.ts'],
    rules: {
      'filenames/match-exported': 'off',
      'filenames/match-regex': 'off',
    },
  },
)

export default tsConfig
