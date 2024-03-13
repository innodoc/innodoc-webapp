import fastifyPlugin from 'fastify-plugin'
import type { FastifyInstance, FastifyPluginCallback } from 'fastify'

import config from '@innodoc/config'

const VITE_PATHS = ['/@fs/', '/@id/', '/@react-refresh', '/@vite/', '/node_modules/', '/src/']

const isViteDevRequest = (url: string) => VITE_PATHS.some((path) => url.startsWith(path))

function requestLogging(app: FastifyInstance) {
  app.addHook('onResponse', (req, reply, done) => {
    if (!isViteDevRequest(req.originalUrl)) {
      req.log.info({ url: req.originalUrl, statusCode: reply.statusCode }, `Request`)
    }
    done()
  })
}

const loggingPlugin: FastifyPluginCallback = function (app, opts, done) {
  if (!config.isProduction) {
    requestLogging(app)
  }
  done()
}

const logging = fastifyPlugin(loggingPlugin, { name: 'logging' })

export default logging
