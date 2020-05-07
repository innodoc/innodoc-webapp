const nextBuildId = require('next-build-id')

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
  generateBuildId: () => {
    const envVal = process.env('NEXTJS_WEBAPP_BUILD_ID') // Passed in CI
    if (envVal) {
      return envVal
    }
    return nextBuildId({ dir: __dirname }) // Use git commit
  },
  webpack,
}
