const addAntd = require('./addAntd')
const addMiniCssExtractPlugin = require('./addMiniCssExtractPlugin')
const addSugarSs = require('./addSugarSs')
const addSvgIcons = require('./addSvgIcons')
const addWoff2FileLoader = require('./addWoff2FileLoader')
const printDebugInfo = require('./printDebugInfo')

module.exports = (prevConfig, options) => {
  const config = { ...prevConfig }
  addSugarSs(config, options)
  addAntd(config, options)
  addMiniCssExtractPlugin(config, options)
  addSvgIcons(config)
  addWoff2FileLoader(config)

  if (process.env.PRINT_WEBPACK_DEBUG_INFO) {
    printDebugInfo(config, options)
  }

  return config
}
