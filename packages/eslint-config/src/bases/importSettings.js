// Separate import settings, so they can be applied late
module.exports = {
  settings: {
    // We require extensions as does Node.js ESM
    'import/extensions': ['error', 'ignorePackages'],

    // Mark workspaces as internal for proper import sorting
    'import/internal-regex': '^@innodoc/',

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

    // eslint-import-resolver-node (using browserify/resolve) does not support
    // ESM! (https://github.com/browserify/resolve/issues/222)
    // We add a custom resolver which can handle yarn berry/pnp.
    'import/resolver': {
      [require.resolve('../resolver.js')]: {},
    },
  },
}
