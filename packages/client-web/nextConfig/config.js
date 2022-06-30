const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } = require('next/constants')
const nextBuildId = require('next-build-id')

const { i18n } = require('./next-i18next.config')
const webpack = require('./webpack')
// const getServerRuntimeConfig = require('./getServerRuntimeConfig')

const config = (phase, { defaultConfig }) => {
  // const isRuntime = [PHASE_PRODUCTION_SERVER, PHASE_DEVELOPMENT_SERVER].includes(phase)
  // const serverRuntimeConfig = getServerRuntimeConfig(isRuntime)
  // const publicRuntimeConfig = {}
  // if (serverRuntimeConfig.manifest) {
  //   const { languages } = serverRuntimeConfig.manifest
  //   ;[publicRuntimeConfig.defaultLanguage, ...publicRuntimeConfig.otherLanguages] = languages
  // }

  const nextConfig = {
    ...defaultConfig,
    // serverRuntimeConfig,
    // publicRuntimeConfig,
    webpack,
    i18n,

    // Only use .js (not .jsx)
    pageExtensions: ['js'],

    // GZIP compression should happen in reverse proxy
    compress: false,

    swcMinify: phase === PHASE_PRODUCTION_SERVER,

    // Use custom build ID (CI) or generated from git commit (default)
    generateBuildId: () => process.env.NEXTJS_WEBAPP_BUILD_ID || nextBuildId({ dir: __dirname }),
  }

  // Allow prod and dev build to co-exist
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    nextConfig.distDir = '.next-dev'
  }

  return nextConfig
}

module.exports = config
