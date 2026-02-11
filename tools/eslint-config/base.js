import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import { createNodeResolver, importX } from 'eslint-plugin-import-x'
import promise from 'eslint-plugin-promise'
import regexp from 'eslint-plugin-regexp'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'

const groupWithTypes = (/** @type {string} */ re) => [re, String.raw`${re}.*\u0000$`]

const config = defineConfig([
  {
    name: 'innodoc/base',
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    plugins: {
      // https://github.com/un-ts/eslint-plugin-import-x/issues/421
      // @ts-expect-error
      'import-x': importX,
      'simple-import-sort': simpleImportSort,
    },
    extends: [
      js.configs.recommended,
      'import-x/flat/recommended',
      'import-x/flat/typescript',
      promise.configs['flat/recommended'],
      regexp.configs['flat/recommended'],
      unicorn.configs.recommended,
    ],
    languageOptions: {
      globals: { ...globals.es2021 },
    },
    rules: {
      // Enforce all block statements to be wrapped in curly braces
      curly: 'error',

      // disable as we're using @typescript-eslint/no-restricted-imports
      'no-restricted-imports': 'off',

      // Checked by TypeScript
      'no-dupe-class-members': 'off',
      // https://typescript-eslint.io/troubleshooting/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      'no-undef': 'off',

      'import-x/no-dynamic-require': 'warn',

      // TypeScript provides the same checks
      // https://typescript-eslint.io/linting/troubleshooting/performance-troubleshooting#eslint-plugin-import
      'import-x/named': 'off',
      'import-x/namespace': 'off',
      'import-x/default': 'off',
      'import-x/no-named-as-default-member': 'off',

      // Conflicts with popular library patterns (zod, fastify, etc.)
      'import-x/no-named-as-default': 'off',

      // Doesn't work well with subpath imports
      'import-x/extensions': 'off',

      // Turn on errors for missing imports
      'import-x/no-unresolved': 'error',

      // Import order setup
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-duplicates': 'error',

      'simple-import-sort/imports': [
        'error',
        {
          // custom groups with type imports last in each group
          // https://github.com/lydell/eslint-plugin-simple-import-sort#custom-grouping
          groups: [
            [String.raw`^\u0000`], // side-effects
            groupWithTypes('^node:'), // node modules
            groupWithTypes(String.raw`^@?(?:(?!innodoc\/))\w`), // 3rd party imports
            groupWithTypes(String.raw`^@innodoc\/`),
            [String.raw`(?<!\u0000)$`], // absolute imports
            groupWithTypes('^#'), // subpath exports
            groupWithTypes(String.raw`^\.`), // relative imports
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      'unicorn/no-null': 'off',
      'unicorn/prefer-export-from': 'off', // collides with simple-import-sort
      'unicorn/prevent-abbreviations': 'off',

      'prettier/prettier': 'error',
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          noWarnOnMultipleProjects: true,
        }),
        createNodeResolver(),
      ],
    },
  },
])

export default config
