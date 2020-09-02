const addAntd = require('./addAntd')
const addDotenv = require('./addDotEnv')
const addMiniCssExtractPlugin = require('./addMiniCssExtractPlugin')
const addSugarSs = require('./addSugarSs')
const addSvgIcons = require('./addSvgIcons')
const addWoff2FileLoader = require('./addWoff2FileLoader')
const ignoreTests = require('./ignoreTests')
const printDebugInfo = require('./printDebugInfo')

module.exports = (prevConfig, options) => {
  const config = { ...prevConfig }
  addSugarSs(config, options)
  addAntd(config, options)
  addDotenv(config)
  addMiniCssExtractPlugin(config, options)
  addSvgIcons(config)
  addWoff2FileLoader(config)

  ignoreTests(config) // TODO: needed???

  if (process.env.PRINT_WEBPACK_DEBUG_INFO) {
    printDebugInfo(config, options)
  }

  return config
}
