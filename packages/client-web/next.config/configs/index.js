import antdLess from './antdLess.js'
import appConfig from './appConfig.js'
import bundleAnalyzer from './bundleAnalyzer.js'
import copyMathJaxFonts from './copyMathJaxFonts.js'
import { exportWebpackConfigPre, exportWebpackConfigPost } from './exportWebpackConfig.js'
import extractAntdVariables from './extractAntdVariables.js'
import fetchManifest from './fetchManifest.js'
import indexRedirect from './indexRedirect.js'
import printNextConfig from './printNextConfig.js'
import sugarss from './sugarss.js'
import svgIcons from './svgIcons.js'
import woff2Resource from './woff2Resource.js'

const configs = [
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

export default configs
