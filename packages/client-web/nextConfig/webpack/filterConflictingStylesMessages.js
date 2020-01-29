const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

module.exports = (config) =>
  config.plugins.push(
    new FilterWarningsPlugin({
      // Ignore [mini-css-extract-plugin] warnings
      exclude: /Conflicting order/,
    })
  )
