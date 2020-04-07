import fs from 'fs'
import path from 'path'

import Dotenv from 'dotenv-safe'

const ensureTrailingSlash = (url) => (url.substr(-1) === '/' ? url : `${url}/`)
const rootDir = path.resolve(__dirname, '..', '..', '..')

const getConfig = () => {
  // load Dotenv file
  const dotEnvFile = path.resolve(rootDir, '.env')
  if (!fs.existsSync(dotEnvFile)) {
    throw new Error(
      `Could not find configuration file '${dotEnvFile}'\nCopy '.env.example' to '.env' and edit to your liking.`
    )
  }
  Dotenv.config({
    path: dotEnvFile,
    example: path.resolve(rootDir, '.env.example'),
  })

  // node environment
  let nodeEnv
  if (process.env.NODE_ENV === 'production') {
    nodeEnv = 'production'
  } else {
    nodeEnv = 'development'
  }

  // set root URLs (and ensure trailing slash)
  const appRoot = ensureTrailingSlash(process.env.APP_ROOT)
  const contentRoot = ensureTrailingSlash(process.env.CONTENT_ROOT)
  const staticRoot = process.env.STATIC_ROOT
    ? ensureTrailingSlash(process.env.STATIC_ROOT)
    : `${contentRoot}_static/`

  return {
    appRoot,
    contentRoot,
    jwtSecret: process.env.JWT_SECRET,
    mongoUrl: process.env.MONGO_URL,
    nodeEnv,
    pagePathPrefix: process.env.PAGE_PATH_PREFIX,
    port: parseInt(new URL(appRoot).port, 10),
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
  }
}

export default getConfig
