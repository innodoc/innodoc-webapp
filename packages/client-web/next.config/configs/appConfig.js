const { i18n } = require('../next-i18next.config')

module.exports = async (phase, config) => {
  let generateBuildId
  if (!process.env.NEXTJS_WEBAPP_BUILD_ID) {
    /* eslint-disable-next-line global-require */
    const nextBuildId = require('next-build-id')
    generateBuildId = () => nextBuildId({ dir: __dirname })
  } else {
    generateBuildId = () => process.env.NEXTJS_WEBAPP_BUILD_ID
  }

  return {
    ...config,

    // GZIP compression should happen in reverse proxy
    compress: false,

    // Allow prod and dev build to co-exist
    distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : config.distDir,

    // Use custom build ID (CI) or generated from git commit (default)
    generateBuildId,

    // next-i18next config
    i18n,

    // Only use .js (not .jsx, .ts, ...)
    pageExtensions: ['js'],

    // Minify JS code
    swcMinify: process.env.NODE_ENV === 'production',
  }
}
