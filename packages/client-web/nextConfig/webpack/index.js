const addAntd = require('./addAntd')
const addDotenv = require('./addDotEnv')
// const addPnp = require('./addPnp')
const addSvgIcons = require('./addSvgIcons')
const filterConflictingStylesMessages = require('./filterConflictingStylesMessages')
const ignoreTests = require('./ignoreTests')
const printDebugInfo = require('./printDebugInfo')

module.exports = (prevConfig, options) => {
  const config = { ...prevConfig }
  addAntd(config, options)
  addDotenv(config)
  // addPnp(config)
  addSvgIcons(config)
  filterConflictingStylesMessages(config)
  ignoreTests(config)
  if (process.env.PRINT_WEBPACK_DEBUG_INFO) {
    printDebugInfo(config, options)
  }

  // use file-loader??
  config.module.rules.push({
    test: /\.woff2$/,
    loader: require.resolve('ignore-loader'),
  })

  return config
}
