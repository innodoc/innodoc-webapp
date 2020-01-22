const path = require('path')

module.exports = ({ disablePostcssImportJson, env, file: { extname } }) => ({
  parser: extname === '.sss' ? 'sugarss' : undefined,
  plugins: {
    'postcss-import': {},
    [path.resolve(__dirname, 'postcss-import-json')]: disablePostcssImportJson
      ? false
      : {},
    'postcss-mixins': {},
    precss: {},
    'postcss-color-function': {},
    cssnano: env === 'production' ? {} : false,
  },
})
