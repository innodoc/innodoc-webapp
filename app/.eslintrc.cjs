const path = require('path')

require('@innodoc/eslint-config/patch/modern-module-resolution')

module.exports = {
  root: true,
  ignorePatterns: ['/src/.next*'],
  extends: [
    '@innodoc/eslint-config/airbnb',
    '@innodoc/eslint-config/filenames',
    '@innodoc/eslint-config/nextjs',
    '@innodoc/eslint-config/promise',
    '@innodoc/eslint-config/security',
    '@innodoc/eslint-config/prettier',
    '@innodoc/eslint-config/import-settings',
  ],
  overrides: [
    // next.config
    {
      files: ['next.config/**/*.js'],
      rules: {
        'no-console': 'off',
        'no-restricted-syntax': 'off',
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      },
    },

    // As per nextjs convention filenames in pages function as URL patterns
    {
      files: ['src/pages/**/*.jsx'],
      rules: {
        'filenames/match-exported': ['error', 'kebab'],
        'filenames/match-regex': ['error', '^_?[a-z-]+$', false],
      },
    },

    // Exempt special nextjs page files and dynamic routes
    {
      files: [
        'src/pages/_+(app|error|document).jsx',
        'src/pages/\\[*\\]/*.jsx',
        'src/pages/*/\\[*\\].jsx',
      ],
      rules: {
        'filenames/match-exported': 'off',
        'filenames/match-regex': 'off',
      },
    },
  ],
  settings: {
    // Next.js rootDir
    next: { rootDir: path.resolve(__dirname, 'src') },
  },
}
