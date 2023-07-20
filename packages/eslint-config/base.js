module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:import/typescript',
    'plugin:regexp/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'filenames', 'import', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2023,
    project: true,
  },
  ignorePatterns: ['**/.eslintrc.cjs', '**/.cache', '**/coverage', '**/dist', '**/node_modules'],
  settings: {
    'import/extensions': ['.ts'],

    // Mark workspaces as internal for proper import sorting
    'import/internal-regex': '^@innodoc\\/',

    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },

    'import/resolver': {
      typescript: {
        // always try to resolve types under `<root>@types` directory even it
        // doesn't contain any source code, like `@types/unist`
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    // ignore exponential and polynomial backtracking
    'regexp/no-super-linear-backtracking': 'off',

    // Enforce all block statements to be wrapped in curly braces
    curly: 'error',

    /////////////////// TypeScript

    // Indentation is handled by prettier
    // https://typescript-eslint.io/rules/indent/
    '@typescript-eslint/indent': 'off',

    // Prefer interfaces for type definitions
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

    // Consistent use of type imports
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: false,
      },
    ],

    /////////////////// Import

    // TypeScript provides the same checks
    // https://typescript-eslint.io/docs/linting/troubleshooting#eslint-plugin-import
    'import/named': 'off',
    'import/namespace': 'off',
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',

    /////////////////// Filenames

    'filenames/match-exported': 'error',

    // Allow camelCase.js + PascalCase.js filenames
    'filenames/match-regex': ['error', '^[A-Za-z][a-z0-9]*(?:[A-Z][a-z0-9]*)*(?:[A-Z]?)$', false],

    // No index files as it makes searching for files horrible
    'filenames/no-index': 'error',

    /////////////////// Imports

    // Turn on errors for missing imports
    'import/no-unresolved': 'error',

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
          // Monorepo package
          {
            pattern: '@innodoc/**',
            group: 'external',
            position: 'after', // put after `external`
          },
          // Internal module from same package (via package.json `imports` field)
          {
            pattern: '\\#*',
            group: 'internal',
          },
          // {
          //   pattern: '#test-utils',
          //   group: 'external',
          // },
        ],
      },
    ],

    /////////////////// Prettier

    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
  },

  overrides: [
    // .d.ts files
    {
      files: ['**/*.d.ts'],
      rules: {
        'filenames/match-exported': 'off',
        'filenames/match-regex': 'off',
      },
    },
  ],
}
