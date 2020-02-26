import path from 'path'
import express from 'express'

import getConfig from './getConfig'
import createNextApp, { setupExpress } from './nextApp'

const startServer = async (rootDir) => {
  const srcDir = path.resolve(rootDir, 'packages', 'client-web', 'src')
  const config = getConfig(rootDir)
  const nextApp = await createNextApp(srcDir, config.nodeEnv)
  const expressApp = express()
  setupExpress(expressApp, nextApp, config)
  await expressApp.listen(config.port)
  return config
}

export default startServer
