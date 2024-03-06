import fs from 'node:fs/promises'
import path from 'node:path'

import fastifySwagger from '@fastify/swagger'
import scalarApiReference from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'
import { createServer as viteCreateServer } from 'vite'

import config from '@innodoc/config'

import loggingPlugin from '#plugins/logging'
import { getServerPath } from '#utils'

const certPath = path.join(getServerPath(), 'cert')

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
  http2: true,
  https: {
    key: await fs.readFile(path.join(certPath, 'key.pem')),
    cert: await fs.readFile(path.join(certPath, 'cert.pem')),
  },
})

async function makeAppDev() {
  const app = fastify(await options())

  // Custom logging
  await app.register(loggingPlugin)

  // Print routes on start-up
  // await app.register(import('fastify-print-routes'))

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'innoDoc API',
        description: 'innoDoc backend service',
        version: '1.0.0',
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
  })

  // Scalar API Reference
  await app.register(scalarApiReference, {
    routePrefix: '/reference',
  })

  // Taken from: github.com/royalswe/vike-fastify-boilerplate/blob/main/server/index.ts
  const viteServer = await viteCreateServer({
    root: path.join(config.rootDir, 'packages', 'app'),
    server: {
      middlewareMode: true,
      https: {
        key: await fs.readFile(path.join(certPath, 'key.pem')),
        cert: await fs.readFile(path.join(certPath, 'cert.pem')),
      },
      hmr: {
        protocol: 'wss',
        clientPort: 24032,
        port: 24032,
      },
    },
  })

  app.addHook('onRequest', async (request, reply) => {
    const next = () =>
      new Promise<void>((resolve) => {
        viteServer.middlewares(request.raw, reply.raw, resolve)
      })
    await next()
  })

  return app
}

export default makeAppDev
