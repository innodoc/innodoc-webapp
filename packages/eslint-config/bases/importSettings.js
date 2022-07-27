// Separate import settings, so they can be applied late
module.exports = {
  rules: {
    // We require extensions as does Node.js ESM
    'import/extensions': ['error', 'ignorePackages'],

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
  },
  settings: {
    // Mark workspaces as internal for proper import sorting
    'import/internal-regex': '^@innodoc/',
  },
}
