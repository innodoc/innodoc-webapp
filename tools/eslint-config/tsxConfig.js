import eslintPluginDeprecation from 'eslint-plugin-deprecation'
import eslintPluginFilenames from 'eslint-plugin-filenames'
import eslintPluginImport from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginPromise from 'eslint-plugin-promise'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRedux from 'eslint-plugin-react-redux'
import eslintPluginRegexp from 'eslint-plugin-regexp'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

import parserOptions from './parserOptions.js'
import rules from './rules.js'

const tsConfig = typescriptEslint.config({
  files: ['**/*.tsx'],
  plugins: {
    deprecation: eslintPluginDeprecation,
    filenames: eslintPluginFilenames,
    import: eslintPluginImport,
    'jsx-a11y': jsxA11y,
    prettier: eslintPluginPrettier,
    promise: eslintPluginPromise,
    react,
    'react-hooks': reactHooks,
    'react-redux': reactRedux,
    regexp: eslintPluginRegexp,
    'simple-import-sort': eslintPluginSimpleImportSort,
  },
  languageOptions: {
    globals: {
      ...globals.es2021,
      ...globals.node,
    },
    parserOptions: {
      ...react.configs.recommended.parserOptions,
      ...react.configs['jsx-runtime'].parserOptions,
      ecmaVersion: 'latest',
      project: true,
      sourceType: 'module',
      ...parserOptions,
    },
  },
  settings: {
    'import/extensions': ['.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        ...parserOptions,
      },
    },
    react: { version: 'detect' },
  },
  rules: {
    // Plugin configs
    ...eslintPluginDeprecation.configs.recommended.rules,
    ...eslintPluginImport.configs.typescript.rules,
    ...eslintPluginPromise.configs.recommended.rules,
    ...eslintPluginPrettier.configs.recommended.rules,

    // React plugin configs
    ...jsxA11y.configs.recommended.rules,
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
    ...reactHooks.configs.recommended.rules,
    ...reactRedux.configs.recommended.rules,

    // Custom rules
    ...rules.eslint,
    ...rules.filenames,
    ...rules.import,
    ...rules.prettier,
    ...rules.regexp,
    ...rules.simpleImportSort,
    ...rules.typescript,
    ...rules.unicorn,

    // Allow to "omit" props using destructuring w/o having them marked as "unused"
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  },
})

export default tsConfig
