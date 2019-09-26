const postcssImport = require('postcss-import')
const precss = require('precss')
const postcssColorFunction = require('postcss-color-function')
const postcssMixins = require('postcss-mixins')
const cssnano = require('cssnano')
const postcssImportJson = require('./postcss-import-json')

const plugins = [
  postcssImport(),
  postcssImportJson(),
  postcssMixins(),
  precss(),
  postcssColorFunction(),
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(cssnano())
}

module.exports = ({ file: { extname } }) => ({
  parser: extname === '.sss' ? 'sugarss' : undefined,
  plugins,
})
