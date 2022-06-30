import path from 'path'

import { loadEnvConfig } from '@next/env'
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
    loadEnvConfig(path.resolve(__dirname, '..', '..', '..'))
    const nextApp = await createNextApp()
    logger = configureLogger().getLogger('appserver')
    await connectDb()
    const expressApp = await createExpressApp(nextApp)
    const server = expressApp.listen(process.env.APP_PORT, process.env.APP_HOST)
    httpTerminator = createHttpTerminator({ server })
    const msg = `Started ${process.env.NODE_ENV} server on ${process.env.APP_HOST}:${process.env.APP_PORT}.`
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
