const nextBuildId = require('next-build-id')
const webpack = require('./webpack')

const getServerRuntimeConfig = require('./getServerRuntimeConfig')

module.exports = {
  // Only use .js (not .jsx)
  pageExtensions: ['js'],

  // Pass config
  serverRuntimeConfig: getServerRuntimeConfig(),

  // GZIP compression should happen in reverse proxy
  compress: false,

  // Use custom build ID (CI) or generated from git commit (default)
  generateBuildId: () => process.env.NEXTJS_WEBAPP_BUILD_ID || nextBuildId({ dir: __dirname }),

  webpack,
}
