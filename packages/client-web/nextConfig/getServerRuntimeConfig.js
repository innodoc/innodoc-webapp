// TODO: remove (replace all this with env vars)

const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')
const Dotenv = require('dotenv')

const rootDir = path.resolve(__dirname, '..', '..', '..')

const ensureTrailingSlash = (url) => (url.substr(-1) === '/' ? url : `${url}/`)

const getAbsPath = (val) => (path.isAbsolute(val) ? val : path.resolve(rootDir, val))

const getManifest = () => {
  const loadManifestScript = path.resolve(__dirname, 'loadManifest.js')
  const jsonData = execSync(
    `yarn node ${loadManifestScript} ${process.env.CONTENT_ROOT}`
  ).toString()
  try {
    return JSON.parse(jsonData)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`${e}\n${jsonData}`)
  }
  return undefined
}

const getServerRuntimeConfig = (isRuntime) => {
  // Load env config
  const dotEnvFile = path.resolve(rootDir, '.env')
  if (!fs.existsSync(dotEnvFile)) {
    throw new Error(
      `Could not find configuration file '${dotEnvFile}'\nCopy '.env.local.example' to '.env.local' and edit to your liking.`
    )
  }
  Dotenv.config({ path: dotEnvFile })

  // Node environment
  let nodeEnv
  if (process.env.NODE_ENV === 'production') {
    nodeEnv = 'production'
  } else {
    nodeEnv = 'development'
  }

  // Set root URLs (and ensure trailing slash)
  const appRoot = ensureTrailingSlash(process.env.APP_ROOT)
  const contentRoot = ensureTrailingSlash(process.env.CONTENT_ROOT)
  const staticRoot = process.env.STATIC_ROOT
    ? ensureTrailingSlash(process.env.STATIC_ROOT)
    : `${contentRoot}_static/`

  // Manifest (only needed at runtime)
  const manifest = isRuntime ? getManifest() : undefined

  // Copy PDF version
  let pdfFilename
  try {
    const pdfFilepathSrc = getAbsPath(process.env.PDF_FILE)
    const pdfFileBasename = path.basename(process.env.PDF_FILE)
    const pdfFilepathDest = path.resolve(__dirname, '..', 'src', 'public', pdfFileBasename)
    fs.copyFileSync(pdfFilepathSrc, pdfFilepathDest)
    pdfFilename = pdfFileBasename
  } catch (e) {
    console.warn(`Warning: ${e}`)
  }

  // Discourse integration
  let discourseSsoSecret
  let discourseUrl
  try {
    discourseUrl = new URL(process.env.DISCOURSE_URL)
    discourseUrl = discourseUrl.toString()
    discourseSsoSecret = process.env.DISCOURSE_SSO_SECRET
  } catch (e) {
    console.warn(`Warning: Discourse integration disabled`)
  }

  return {
    appRoot,
    contentRoot,
    discourseSsoSecret,
    discourseUrl,
    ftSearch: process.env.FT_SEARCH === 'true',
    pdfFilename,
    jwtSecret: process.env.JWT_SECRET,
    logErrorEmail: process.env.LOG_ERROR_EMAIL,
    logFile: process.env.LOG_FILE.length ? getAbsPath(process.env.LOG_FILE) : null,
    manifest,
    mongoUrl: process.env.MONGO_URL,
    nodeEnv,
    pagePathPrefix: process.env.PAGE_PATH_PREFIX || 'page',
    host: process.env.APP_HOST,
    port: parseInt(process.env.APP_PORT, 10),
    sectionPathPrefix: process.env.SECTION_PATH_PREFIX || 'section',
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
      senderAddress: process.env.SMTP_SENDER,
      skipMails: process.env.SMTP_SKIP_MAILS === 'yes',
    },
    staticRoot,
  }
}

module.exports = getServerRuntimeConfig
