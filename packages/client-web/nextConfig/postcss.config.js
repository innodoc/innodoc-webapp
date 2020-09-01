const path = require('path')

module.exports = ({ disablePostcssImportJson, file: { extname } }) => ({
  parser: extname === '.sss' ? require.resolve('sugarss') : undefined,
  plugins: {
    [require.resolve('postcss-import')]: {},
    [path.resolve(__dirname, 'postcss-import-json')]: disablePostcssImportJson ? false : {},
    [require.resolve('postcss-mixins')]: {},
    [require.resolve('precss')]: {},
    [require.resolve('postcss-color-function')]: {},
  },
})
