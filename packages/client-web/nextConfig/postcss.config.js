const path = require('path')

module.exports = ({ disablePostcssImportJson, file: { extname } }) => ({
  parser: extname === '.sss' ? 'sugarss' : undefined,
  plugins: {
    'postcss-import': {},
    [path.resolve(__dirname, 'postcss-import-json')]: disablePostcssImportJson ? false : {},
    'postcss-mixins': {},
    precss: {},
    'postcss-color-function': {},
  },
})
