const path = require('path')

const cssnanoOpts = { preset: ['default', { discardComments: { removeAll: true } }] }

module.exports = ({ disablePostcssImportJson, file }) => ({
  parser: path.extname(file) === '.sss' ? require.resolve('sugarss') : undefined,
  plugins: {
    [require.resolve('postcss-import')]: {},
    [path.resolve(__dirname, 'postcss-import-json')]: disablePostcssImportJson ? false : {},
    [require.resolve('postcss-mixins')]: {},
    [require.resolve('precss')]: {},
    [require.resolve('postcss-color-function')]: {},
    [require.resolve('cssnano')]: process.env.NODE_ENV === 'production' ? cssnanoOpts : false,
  },
})
