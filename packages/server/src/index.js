/* eslint-disable no-console */
import { createHttpTerminator } from 'http-terminator'

import createExpressApp from './createExpressApp'
import createNextApp from './createNextApp'
import { connectDb, disconnectDb } from './db'
import getConfig from './getConfig'

let httpTerminator

const shutdown = async () => {
  await disconnectDb()
  if (httpTerminator) {
    await httpTerminator.terminate()
  }
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

const startServer = async () => {
  try {
    const config = getConfig()
    const nextApp = await createNextApp(config)
    await connectDb(config)
    const expressApp = createExpressApp(config, nextApp)
    const server = await expressApp.listen(config.port, config.host)
    httpTerminator = createHttpTerminator({ server })
    const msg = `Started ${config.nodeEnv} server on ${config.host}:${config.port}.`
    console.info(msg)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

if (require.main === module) {
  startServer()
}

export { shutdown } // for testing
export default startServer
