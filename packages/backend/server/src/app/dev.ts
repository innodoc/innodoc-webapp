import fastifyPlugin from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'

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

const devPlugin: FastifyPluginAsync = async function (app) {
  // Custom logging
  await app.register(loggingPlugin)

  // Print routes on start-up
  await app.register(import('fastify-print-routes'))

  // Print routes on start-up
  await app.register(import('#plugins/viteDevServer'))
}

const dev = fastifyPlugin(devPlugin, { name: 'dev' })

export { options }
export default dev
