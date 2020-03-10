import fs from 'fs'
import path from 'path'

import Dotenv from 'dotenv-safe'

const ensureTrailingSlash = (url) => (url.substr(-1) === '/' ? url : `${url}/`)

const getConfig = (rootDir) => {
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
  let portVarName
  if (process.env.NODE_ENV === 'production') {
    nodeEnv = 'production'
    portVarName = 'PROD_PORT'
  } else {
    nodeEnv = 'development'
    portVarName = 'DEV_PORT'
  }

  // port
  if (!Object.prototype.hasOwnProperty.call(process.env, portVarName)) {
    throw new Error(`You need to configure ${portVarName} in your .env file!`)
  }
  const port = parseInt(process.env[portVarName], 10)
  if (Number.isNaN(port)) {
    throw new Error(`Could not parse ${portVarName}!`)
  }

  // set root URLs (and ensure trailing slash)
  const appRoot = ensureTrailingSlash(process.env.APP_ROOT)
  const contentRoot = ensureTrailingSlash(process.env.CONTENT_ROOT)
  const staticRoot = process.env.STATIC_ROOT
    ? ensureTrailingSlash(process.env.STATIC_ROOT)
    : `${contentRoot}_static/`

  return {
    nodeEnv,
    port,
    appRoot,
    contentRoot,
    staticRoot,
    sectionPathPrefix: process.env.SECTION_PATH_PREFIX,
    pagePathPrefix: process.env.PAGE_PATH_PREFIX,
  }
}

export default getConfig
