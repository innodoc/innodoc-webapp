const { execSync } = require('child_process')
const path = require('path')

const Dotenv = require('dotenv-safe')
const nextBuildId = require('next-build-id')
const webpack = require('./webpack')

const rootDir = path.resolve(__dirname, '..', '..', '..')

const getManifest = () => {
  const loadManifestScript = path.resolve(__dirname, 'loadManifest.js')
  const output = execSync(`yarn node ${loadManifestScript} ${process.env.CONTENT_ROOT}`).toString()
  try {
    return JSON.parse(output)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`${e}\n${output}`)
  }
  return undefined
}

Dotenv.config({
  path: path.resolve(rootDir, '.env'),
  example: path.resolve(rootDir, '.env.example'),
  allowEmptyValues: true,
})

const envConfigMap = {
  appRoot: 'APP_ROOT',
  contentRoot: 'CONTENT_ROOT',
  staticRoot: 'STATIC_ROOT',
  sectionPathPrefix: 'SECTION_PATH_PREFIX',
  pagePathPrefix: 'PAGE_PATH_PREFIX',
}

module.exports = {
  // Only use .js (not .jsx)
  pageExtensions: ['js'],

  // Pass config
  serverRuntimeConfig: {
    ...Object.entries(envConfigMap).reduce((acc, [k, v]) => {
      acc[k] = process.env[v]
      return acc
    }, {}),
    manifest: getManifest(),
  },

  // GZIP compression should happen in reverse proxy
  compress: false,

  // Use custom build ID (CI) or generated from git commit (default)
  generateBuildId: () => process.env.NEXTJS_WEBAPP_BUILD_ID || nextBuildId({ dir: __dirname }),
  webpack,
}
