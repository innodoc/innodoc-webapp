const webpack = require('./webpack')

module.exports = {
  // Only use .js (not .jsx)
  pageExtensions: ['js'],
  // GZIP compression should happen in reverse proxy
  compress: false,
  // CSS modules with local scope
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },
  webpack,
}
