import fs from 'fs'
import path from 'path'

import Dotenv from 'dotenv-safe'

const getConfig = (rootDir) => {
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

  let nodeEnv
  let portVarName
  if (process.env.NODE_ENV === 'production') {
    nodeEnv = 'production'
    portVarName = 'PROD_PORT'
  } else {
    nodeEnv = 'development'
    portVarName = 'DEV_PORT'
  }

  if (!Object.prototype.hasOwnProperty.call(process.env, portVarName)) {
    throw new Error(`You need to configure ${portVarName} in your .env file!`)
  }
  const port = parseInt(process.env[portVarName], 10)
  if (Number.isNaN(port)) {
    throw new Error(`Could not parse ${portVarName}!`)
  }

  // ensure trailing slash
  const contentRoot =
    process.env.CONTENT_ROOT.substr(-1) === '/'
      ? process.env.CONTENT_ROOT
      : `${process.env.CONTENT_ROOT}/`

  let staticRoot = process.env.STATIC_ROOT
    ? process.env.STATIC_ROOT
    : `${contentRoot}_static/`
  staticRoot = staticRoot.substr(-1) === '/' ? staticRoot : `${staticRoot}/`

  return { contentRoot, staticRoot, nodeEnv, port }
}

export default getConfig