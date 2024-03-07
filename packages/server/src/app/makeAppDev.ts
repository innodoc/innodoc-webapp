import fastify from 'fastify'

import loggingPlugin from '#plugins/logging'
import { devCerts } from '#utils'

const options = async () => ({
  disableRequestLogging: true, // turn off globally (prevent vite dev server spamming)
  logger: {
    msgPrefix: '[HTTP] ',
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  ...(await devCerts()),
  http2: true,
})

async function makeAppDev() {
  const app = fastify(await options())

  // Custom logging
  await app.register(loggingPlugin)

  // Print routes on start-up
  await app.register(import('fastify-print-routes'))

  // Print routes on start-up
  await app.register(import('#plugins/viteDevServer'))

  return app
}

export default makeAppDev
