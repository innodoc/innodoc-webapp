const path = require('path')

// TODO: Add cssnano in production

module.exports = ({ disablePostcssImportJson, file }) => ({
  parser: path.extname(file) === '.sss' ? require.resolve('sugarss') : undefined,
  plugins: {
    [require.resolve('postcss-import')]: {},
    [path.resolve(__dirname, 'postcss-import-json')]: disablePostcssImportJson ? false : {},
    [require.resolve('postcss-mixins')]: {},
    [require.resolve('precss')]: {},
    [require.resolve('postcss-color-function')]: {},
  },
})
