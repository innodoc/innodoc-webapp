const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (config, { dev, isServer }) => {
  if (!isServer) {
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: dev ? 'static/css/[name].css' : 'static/css/[name].[contenthash:8].css',
        chunkFilename: dev
          ? 'static/css/[name].chunk.css'
          : 'static/css/[name].[contenthash:8].chunk.css',
        ignoreOrder: true,
      })
    )
  }
}
