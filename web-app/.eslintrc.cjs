require('@innodoc/eslint-config/patch/modern-module-resolution')

module.exports = {
  root: true,
  ignorePatterns: ['node_modules'],
  extends: [
    '@innodoc/eslint-config/base',
    '@innodoc/eslint-config/filenames',
    '@innodoc/eslint-config/react',
    '@innodoc/eslint-config/react-redux',
    '@innodoc/eslint-config/promise',
    '@innodoc/eslint-config/prettier',
    '@innodoc/eslint-config/import',
  ],

  overrides: [
    // Page routing naming convenction
    {
      files: ['src/pages/**/*.tsx'],
      rules: {
        'filenames/match-exported': ['error', 'kebab'],
        'filenames/match-regex': ['error', '^[a-z-]+\\.page$', false],
      },
    },

    {
      files: ['vite.config.ts', 'src/renderer/_+(default|error).page*.tsx'],
      rules: {
        'filenames/match-exported': 'off',
        'filenames/match-regex': 'off',
      },
    },
  ],
}
