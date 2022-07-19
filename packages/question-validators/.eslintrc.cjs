require('@innodoc/eslint-config/patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    '@innodoc/eslint-config/airbnb-base',
    '@innodoc/eslint-config/filenames',
    '@innodoc/eslint-config/security',
    '@innodoc/eslint-config/prettier',
    '@innodoc/eslint-config/import-settings',
  ],
}
