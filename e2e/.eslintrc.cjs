require('@innodoc/eslint-config/patch/modern-module-resolution')

module.exports = {
  root: true,
  ignorePatterns: ['**/.cache', '/content', '/screenshots'],
  extends: [
    '@innodoc/eslint-config/airbnb-base',
    '@innodoc/eslint-config/filenames',
    '@innodoc/eslint-config/playwright',
    '@innodoc/eslint-config/regexp',
    '@innodoc/eslint-config/prettier',
    '@innodoc/eslint-config/import-settings',
  ],
}
