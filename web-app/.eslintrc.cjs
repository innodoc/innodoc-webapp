const path = require('path')

require('@innodoc/eslint-config/patch/modern-module-resolution')

module.exports = {
  root: true,
  ignorePatterns: ['.next*'],
  extends: [
    '@innodoc/eslint-config/base',
    '@innodoc/eslint-config/filenames',
    '@innodoc/eslint-config/react',
    '@innodoc/eslint-config/react-redux',
    '@innodoc/eslint-config/nextjs',
    '@innodoc/eslint-config/promise',
    '@innodoc/eslint-config/prettier',
    '@innodoc/eslint-config/import',
  ],

  settings: {
    next: { rootDir: path.join(__dirname, 'src') },
  },

  overrides: [
    // As per nextjs convention filenames in pages function as URL patterns
    {
      files: ['src/pages/**/*.tsx'],
      rules: {
        'filenames/match-exported': ['error', 'kebab'],
        'filenames/match-regex': ['error', '^_?[a-z-]+$', false],
      },
    },

    // Exempt special nextjs page files and dynamic routes
    {
      files: [
        'src/pages/_+(app|error|document).tsx',
        'src/pages/\\[*\\]/*.tsx',
        'src/pages/*/\\[*\\].tsx',
      ],
      rules: {
        'filenames/match-exported': 'off',
        'filenames/match-regex': 'off',
      },
    },
  ],
}
