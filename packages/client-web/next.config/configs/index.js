const antdLess = require('./antdLess')
const appConfig = require('./appConfig')
const bundleAnalyzer = require('./bundleAnalyzer')
const copyMathJaxFonts = require('./copyMathJaxFonts')
const { exportWebpackConfigPre, exportWebpackConfigPost } = require('./exportWebpackConfig')
const extractAntdVariables = require('./extractAntdVariables')
const fetchManifest = require('./fetchManifest')
const indexRedirect = require('./indexRedirect')
const printNextConfig = require('./printNextConfig')
const sugarss = require('./sugarss')
const svgIcons = require('./svgIcons')
const woff2Resource = require('./woff2Resource')

module.exports = [
  process.env.EXPORT_WEBPACK_CONFIG && exportWebpackConfigPost,
  fetchManifest,
  appConfig,
  copyMathJaxFonts,
  extractAntdVariables,
  antdLess,
  sugarss,
  svgIcons,
  woff2Resource,
  indexRedirect,
  process.env.ANALYZE === 'true' && bundleAnalyzer,
  process.env.PRINT_NEXT_CONFIG === 'true' && printNextConfig,
  process.env.EXPORT_WEBPACK_CONFIG && exportWebpackConfigPre,
].filter(Boolean)
