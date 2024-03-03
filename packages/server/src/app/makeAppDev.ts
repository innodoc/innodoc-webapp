import fs from 'node:fs/promises'
import path from 'node:path'

import fastifySwagger from '@fastify/swagger'
import scalarApiReference from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import fastifyPrintRoutes from 'fastify-print-routes'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'
import { createServer as viteCreateServer } from 'vite'

import config from '@innodoc/config'

import { getServerPath } from '#utils'

const certPath = path.join(getServerPath(), 'cert')

async function options() {
  return {
    logger: {
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
  }
}

async function makeAppDev() {
  const app = fastify(await options())

  // Print routes on start-up
  await app.register(fastifyPrintRoutes)

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
