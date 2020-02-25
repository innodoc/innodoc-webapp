import path from 'path'

import getConfig from './getConfig'
import startServer from './startServer'

const rootDir = path.resolve(__dirname, '..', '..', '..')
const srcDir = path.resolve(rootDir, 'packages', 'client-web', 'src')

try {
  const { contentRoot, staticRoot, nodeEnv, port } = getConfig(rootDir)
  startServer(srcDir, port, staticRoot, contentRoot, nodeEnv)
} catch (e) {
  console.error(e)
  process.exit(1)
}
