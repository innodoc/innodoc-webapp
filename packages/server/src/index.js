import { createHttpTerminator } from 'http-terminator'

import createExpressApp from './createExpressApp'
import createNextApp from './createNextApp'
import { connectDb, disconnectDb } from './db'
import { configureLogger } from './logger'

let httpTerminator
let logger

const shutdown = async () => {
  await disconnectDb()
  if (httpTerminator) {
    await httpTerminator.terminate()
  }
  if (logger) {
    logger.info('App server shut down.')
  }
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

const startServer = async () => {
  try {
    const nextApp = await createNextApp()
    const { serverRuntimeConfig: config } = nextApp.nextConfig
    logger = configureLogger(config).getLogger('appserver')
    await connectDb(config)
    const expressApp = createExpressApp(config, nextApp)
    const server = expressApp.listen(config.port, config.host)
    httpTerminator = createHttpTerminator({ server })
    const msg = `Started ${config.nodeEnv} server on ${config.host}:${config.port}.`
    logger.info(msg)
  } catch (err) {
    console.log('Error while starting server', err) // eslint-disable-line no-console
    if (logger) {
      logger.error(err)
    }
    process.exit(1)
  }
}

if (require.main === module) {
  startServer()
}

export { shutdown } // for testing
export default startServer
