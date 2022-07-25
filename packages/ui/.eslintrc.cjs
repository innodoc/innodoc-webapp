const path = require('path')

require('@innodoc/eslint-config/patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    '@innodoc/eslint-config/airbnb',
    '@innodoc/eslint-config/filenames',
    '@innodoc/eslint-config/react-redux',
    '@innodoc/eslint-config/promise',
    '@innodoc/eslint-config/security',
    '@innodoc/eslint-config/prettier',
    '@innodoc/eslint-config/import-settings',
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
  settings: {
    // Add .sss
    'import/ignore': ['node_modules', /\.(coffee|scss|css|sss|less|hbs|svg|json)$/.toString()],
  },
}
