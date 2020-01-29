const addAntd = require('./addAntd')
const addDotenv = require('./addDotEnv')
const addSvgIcons = require('./addSvgIcons')
const filterConflictingStylesMessages = require('./filterConflictingStylesMessages')
const ignoreTests = require('./ignoreTests')
const printDebugInfo = require('./printDebugInfo')

module.exports = (prevConfig, options) => {
  const config = { ...prevConfig }
  addAntd(config, options)
  addDotenv(config)
  addSvgIcons(config)
  filterConflictingStylesMessages(config)
  ignoreTests(config)
  if (process.env.PRINT_WEBPACK_DEBUG_INFO) {
    printDebugInfo(config, options)
  }
  return config
}
