const path = require('path')
const config = require('./postcss.config')

// Insert postcss-import-json plugin
const pluginsKeyValues = Object.entries(config.plugins)
pluginsKeyValues.splice(1, 0, [path.resolve(__dirname, 'postcss-import-json'), {}])

module.exports = {
  parser: require.resolve('sugarss'),
  plugins: Object.fromEntries(pluginsKeyValues),
}
