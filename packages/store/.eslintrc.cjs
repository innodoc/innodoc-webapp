require('@innodoc/eslint-config/patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    '@innodoc/eslint-config/base',
    '@innodoc/eslint-config/filenames',
    '@innodoc/eslint-config/react-redux',
    '@innodoc/eslint-config/promise',
    '@innodoc/eslint-config/prettier',
    '@innodoc/eslint-config/import',
  ],
}
