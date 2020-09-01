const PnpWebpackPlugin = require(`pnp-webpack-plugin`)

module.exports = (config) => {
  config.resolve.plugins.push(PnpWebpackPlugin)
  config.resolveLoader.plugins.push(PnpWebpackPlugin.moduleLoader(module))
}
