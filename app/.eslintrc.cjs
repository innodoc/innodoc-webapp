const path = require('path')

require('@innodoc/eslint-config/patch/modern-module-resolution')

module.exports = {
  root: true,
  ignorePatterns: ['/src/.next*'],
  extends: [
    '@innodoc/eslint-config/airbnb',
    '@innodoc/eslint-config/filenames',
    '@innodoc/eslint-config/nextjs',
    '@innodoc/eslint-config/react-redux',
    '@innodoc/eslint-config/promise',
    '@innodoc/eslint-config/security',
    '@innodoc/eslint-config/prettier',
    '@innodoc/eslint-config/import-settings',
  ],
  overrides: [
    {
      files: ['src/components/content/ContentFragment/**/*.js'],
      rules: {
        'import/no-cycle': 'off',
      },
    },
    {
      files: ['src/**/*.+(js|jsx)'],
      rules: {
        'filenames/match-exported': 'error',
      },
    },
    {
      files: ['src/pages/**/*.jsx'],
      rules: {
        'filenames/match-exported': 'off',
      },
    },
    {
      files: ['next.config/**/*.js'],
      rules: {
        'no-console': 'off',
        'no-restricted-syntax': 'off',
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      },
    },
  ],
  settings: {
    // Next.js rootDir
    next: { rootDir: path.resolve(__dirname, 'src') },
    // Add .sss
    'import/ignore': ['node_modules', /\.(coffee|scss|css|sss|less|hbs|svg|json)$/.toString()],
  },
}
