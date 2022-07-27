const path = require('path')

// Separate import settings, so they can be applied late
module.exports = {
  rules: {
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
      },
    ],

    // Turn on errors for missing imports
    'import/no-unresolved': 'error',
  },
  plugins: ['import'],
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],

    // Mark workspaces as internal for proper import sorting
    'import/internal-regex': '^@innodoc/',

    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },

    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: path.resolve('..', '..', '..', '..', 'tsconfig.json'),
      },
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // TypeScript provides the same checks
        // https://typescript-eslint.io/docs/linting/troubleshooting#eslint-plugin-import
        'import/named': 'off',
        'import/namespace': 'off',
        'import/default': 'off',
        'import/no-named-as-default-member': 'off',
      },
    },
  ],
}
