import path from 'path'

import nextBuildId from 'next-build-id'

import nextI18nextConfig from '../next-i18next.config.js'

const __dirname = new URL('.', import.meta.url).pathname

// TODO: this is not needed I think:
// On server-side localePath is the actual directory, but due to the build
// process this is tricky
// nextI18nextConfig.localePath =
//   // __dirname.split(path.sep).at(-1) === 'next.config'
//   __dirname.split(path.sep).at(-1) === 'configs'
//     ? // file compiled in 'NEXT_BUILD_DIR/server/pages'!
//       path.resolve(__dirname, '..', 'src', 'public', 'locales')
//     : // __dirname actual file location
//       path.resolve(__dirname, '..', '..', '..', 'public', 'locales')
// On server-side localePath is the actual directory, but due to the build
// nextI18nextConfig.localePath = path.resolve(__dirname, '..', '..', 'src', 'public', 'locales')

// console.log('appConfig')
// console.log('__dirname', __dirname)
// console.log('nextI18nextConfig', nextI18nextConfig)

const config = async (phase, config) => {
  let generateBuildId
  if (!process.env.NEXTJS_WEBAPP_BUILD_ID) {
    generateBuildId = () => nextBuildId({ dir: new URL('.', import.meta.url).pathname })
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
    i18n: nextI18nextConfig.i18n,

    // Only use .js (not .jsx, .ts, ...)
    pageExtensions: ['js'],

    // Minify JS code
    swcMinify: process.env.NODE_ENV === 'production',
  }
}

export default config
