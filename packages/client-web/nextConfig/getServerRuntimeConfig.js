const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')
const Dotenv = require('dotenv-safe')

const rootDir = path.resolve(__dirname, '..', '..', '..')

const ensureTrailingSlash = (url) => (url.substr(-1) === '/' ? url : `${url}/`)

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

// Load .env
const dotEnvFile = path.resolve(rootDir, '.env')
if (!fs.existsSync(dotEnvFile)) {
  throw new Error(
    `Could not find configuration file '${dotEnvFile}'\nCopy '.env.example' to '.env' and edit to your liking.`
  )
}
Dotenv.config({
  path: path.resolve(rootDir, '.env'),
  example: path.resolve(rootDir, '.env.example'),
  allowEmptyValues: true,
})

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

// Set logFile
let logFile = null
if (process.env.LOG_FILE.length) {
  logFile = path.isAbsolute(process.env.LOG_FILE)
    ? process.env.LOG_FILE
    : path.resolve(rootDir, process.env.LOG_FILE)
}

const getServerRuntimeConfig = () => ({
  appRoot,
  contentRoot,
  jwtSecret: process.env.JWT_SECRET,
  logErrorEmail: process.env.LOG_ERROR_EMAIL,
  logFile,
  manifest: getManifest(),
  mongoUrl: process.env.MONGO_URL,
  nodeEnv,
  pagePathPrefix: process.env.PAGE_PATH_PREFIX,
  host: process.env.APP_HOST,
  port: parseInt(process.env.APP_PORT, 10),
  sectionPathPrefix: process.env.SECTION_PATH_PREFIX,
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    senderAddress: process.env.SMTP_SENDER,
    skipMails: process.env.SMTP_SKIP_MAILS === 'yes',
  },
  staticRoot,
})

module.exports = getServerRuntimeConfig
