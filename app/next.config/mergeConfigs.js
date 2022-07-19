// TODO
// - test bundle analyzer
// - use next.js postcss.config as base?

import antdLess from './configs/antdLess.js'
import appConfig from './configs/appConfig.js'
import bundleAnalyzer from './configs/bundleAnalyzer.js'
import copyMathJaxFonts from './configs/copyMathJaxFonts.js'
import { exportWebpackConfigPre, exportWebpackConfigPost } from './configs/exportWebpackConfig.js'
import extractAntdVariables from './configs/extractAntdVariables.js'
import fetchManifest from './configs/fetchManifest.js'
import indexRedirect from './configs/indexRedirect.js'
import printNextConfig from './configs/printNextConfig.js'
import sugarss from './configs/sugarss.js'
import svgIcons from './configs/svgIcons.js'
import woff2Resource from './configs/woff2Resource.js'

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

// Apply config modules sequentially
export default (phase, { defaultConfig }) =>
  configs.reduce(
    (p, withConfig) => p.then((config) => withConfig(phase, config)),
    Promise.resolve().then(() => defaultConfig)
  )
