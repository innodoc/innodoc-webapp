require('@innodoc/eslint-config/patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    '@innodoc/eslint-config/airbnb',
    '@innodoc/eslint-config/filenames',
    '@innodoc/eslint-config/jest',
    '@innodoc/eslint-config/rtl',
    '@innodoc/eslint-config/regexp',
    '@innodoc/eslint-config/prettier',
    '@innodoc/eslint-config/import-settings',
  ],
}
