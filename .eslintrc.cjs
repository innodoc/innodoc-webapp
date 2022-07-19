require('@innodoc/eslint-config/patch/modern-module-resolution')

module.exports = {
  root: true,
  ignorePatterns: ['coverage', '.yarn', '.pnp.*'],
  extends: [
    '@innodoc/eslint-config/airbnb-base',
    '@innodoc/eslint-config/filenames',
    '@innodoc/eslint-config/promise',
    '@innodoc/eslint-config/security',
    '@innodoc/eslint-config/prettier',
    '@innodoc/eslint-config/import-settings',
  ],
}
