import js from '@eslint/js'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import eslintPluginFilenames from 'eslint-plugin-filenames'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginPromise from 'eslint-plugin-promise'
import eslintPluginRegexp from 'eslint-plugin-regexp'
import globals from 'globals'

const eslintRules = {
  // Enforce all block statements to be wrapped in curly braces
  curly: 'error',
}

const filenamesRules = {
  // Exported name must match filename
  'filenames/match-exported': 'error',

  // Allow camelCase + PascalCase filenames
  'filenames/match-regex': ['error', '^[A-Za-z][a-z0-9]*(?:[A-Z][a-z0-9]*)*(?:[A-Z]?)$', false],

  // No index files as it makes searching for files horrible
  'filenames/no-index': 'error',
}

const importRules = {
  // TypeScript provides the same checks
  // https://typescript-eslint.io/linting/troubleshooting/performance-troubleshooting#eslint-plugin-import
  'import/named': 'off',
  'import/namespace': 'off',
  'import/default': 'off',
  'import/no-named-as-default-member': 'off',

  // Custom import order
  'import/order': [
    'error',
    {
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
      groups: ['builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      pathGroups: [
        {
          pattern: '#test-utils',
          group: 'external',
        },
      ],
    },
  ],

  // Turn on errors for missing imports
  'import/no-unresolved': 'error',
}

const prettierRules = {
  'prettier/prettier': 'error',
}

const regexpRules = {
  // ignore exponential and polynomial backtracking
  'regexp/no-super-linear-backtracking': 'off',
}

const typescriptRules = {
  // Prefer interfaces for type definitions
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

  // Consistent use of type imports
  '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],

  // Indentation is handled by prettier (https://typescript-eslint.io/rules/indent/)
  '@typescript-eslint/indent': 'off',
}

/** @type {import("eslint").Linter.FlatConfig} */
const config = [
  js.configs.recommended,
  {
    files: ['eslint.config.js', '**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      filenames: eslintPluginFilenames,
      import: eslintPluginImport,
      regexp: eslintPluginRegexp,
      promise: eslintPluginPromise,
      prettier: eslintPluginPrettier,
    },
    languageOptions: {
      globals: {
        ...globals.es2021,
        ...globals.node,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2023,
        project: true,
        sourceType: 'module',
      },
    },
    settings: {
      'import/internal-regex': '^@innodoc\\/', // Mark workspaces as internal for proper import sorting
      'import/extensions': ['.ts'],
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: true,
        },
      },
    },
    ignores: ['**/.cache', '**/coverage', '**/dist', '**/node_modules'],
    rules: {
      // Plugin configs
      ...typescriptEslintPlugin.configs['strict-type-checked'].rules,
      ...typescriptEslintPlugin.configs['stylistic-type-checked'].rules,
      ...eslintPluginImport.configs.typescript.rules,
      ...eslintPluginPromise.configs.recommended.rules,
      ...eslintPluginPrettier.configs.recommended.rules,

      // Custom rules
      ...eslintRules,
      ...filenamesRules,
      ...importRules,
      ...prettierRules,
      ...regexpRules,
      ...typescriptRules,
    },
  },

  // No type-checking for JS files
  {
    files: ['*.js'],
    rules: typescriptEslintPlugin.configs['disable-type-checked'].rules,
  },

  // Filename rule exceptions
  {
    files: ['**/*.d.ts', 'eslint.config*.js'],
    rules: {
      'filenames/match-exported': 'off',
      'filenames/match-regex': 'off',
    },
  },
]

export default config
