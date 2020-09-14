const nextBuildId = require('next-build-id')

const webpack = require('./webpack')

const getServerRuntimeConfig = require('./getServerRuntimeConfig')

const parseLink = (href) => {
  if (href.startsWith('/page/')) {
    return ['page', href.slice(6)]
  }
  if (href.startsWith('/section/')) {
    return ['section', href.slice(9)]
  }
  throw new Error(`Malformed link encountered: ${href}`)
}

const serverRuntimeConfig = getServerRuntimeConfig()
const { manifest, pagePathPrefix, sectionPathPrefix } = serverRuntimeConfig

let parsedHomeLink
try {
  parsedHomeLink = parseLink(manifest.home_link)
} catch (e) {
  throw new Error(`Could not parse homeLink: ${manifest.home_link}`)
}
const [contentType, contentId] = parsedHomeLink
const pathPrefix = contentType === 'page' ? pagePathPrefix : sectionPathPrefix
const homeUrl = `/${pathPrefix}/${contentId}`

const redirects = async () => [
  {
    source: '/',
    destination: homeUrl,
    permanent: true,
  },
]

module.exports = {
  serverRuntimeConfig,
  redirects,
  webpack,

  // Only use .js (not .jsx)
  pageExtensions: ['js'],

  // GZIP compression should happen in reverse proxy
  compress: false,

  // Use custom build ID (CI) or generated from git commit (default)
  generateBuildId: () => process.env.NEXTJS_WEBAPP_BUILD_ID || nextBuildId({ dir: __dirname }),
}
