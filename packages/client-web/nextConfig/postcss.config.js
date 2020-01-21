module.exports = ({ disablePostcssImportJson, env, file: { extname } }) => ({
  parser: extname === '.sss' ? 'sugarss' : undefined,
  plugins: {
    'postcss-import': {},
    './postcss-import-json': disablePostcssImportJson ? false : {},
    'postcss-mixins': {},
    precss: {},
    'postcss-color-function': {},
    cssnano: env === 'production' ? {} : false,
  },
})
