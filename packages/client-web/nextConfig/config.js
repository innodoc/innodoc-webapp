const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } = require('next/constants')
const nextBuildId = require('next-build-id')

const webpack = require('./webpack')
const getServerRuntimeConfig = require('./getServerRuntimeConfig')

const config = (phase, { defaultConfig }) => {
  const isRuntime = [PHASE_PRODUCTION_SERVER, PHASE_DEVELOPMENT_SERVER].includes(phase)
  const serverRuntimeConfig = getServerRuntimeConfig(isRuntime)

  const nextConfig = {
    ...defaultConfig,
    serverRuntimeConfig,
    webpack,

    // Only use .js (not .jsx)
    pageExtensions: ['js'],

    // GZIP compression should happen in reverse proxy
    compress: false,

    // Use custom build ID (CI) or generated from git commit (default)
    generateBuildId: () => process.env.NEXTJS_WEBAPP_BUILD_ID || nextBuildId({ dir: __dirname }),
  }

  return nextConfig
}

module.exports = config
