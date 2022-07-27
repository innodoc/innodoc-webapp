const path = require('path')

require('@innodoc/eslint-config/patch/modern-module-resolution')

module.exports = {
  root: true,
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
    // <ContentFragment /> as "recursive document renderer" needs import cycles
    {
      files: ['src/components/content/ContentFragment/**'],
      rules: { 'import/no-cycle': 'off' },
    },

    // AST content doesn't supply IDs for use as keys
    {
      files: ['src/components/content/ContentFragment/ast/**'],
      rules: { 'react/no-array-index-key': 'off' },
    },
  ],
}
