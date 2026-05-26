import type { FastifyPluginAsync } from 'fastify'
import fastifyMiddie from '@fastify/middie'
import fastifyPlugin from 'fastify-plugin'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createServer } from 'vite'
import { FRONTEND_PATH } from '#constants'

/** Get dev server certificates if available. */
async function loadDevCerts() {
  const certPath = path.resolve(import.meta.dirname, '..', '..', '..', 'cert')

  try {
    await fs.access(certPath)
    return {
      https: {
        key: await fs.readFile(path.join(certPath, 'key.pem')),
        cert: await fs.readFile(path.join(certPath, 'cert.pem')),
      },
    }
  } catch {
    return {}
  }
}

const viteDevServerPlugin: FastifyPluginAsync = async (server) => {
  const devCertsOptions = await loadDevCerts()

  const viteDevServer = await createServer({
    appType: 'custom', // Don't intercept HTML requests
    configFile: path.join(FRONTEND_PATH, 'vite.config.ts'),
    root: path.join(FRONTEND_PATH, 'src'),
    publicDir: path.join(FRONTEND_PATH, 'public'),
    server: {
      ...devCertsOptions,
      middlewareMode: true,
      hmr: {
        protocol: 'wss',
      },
    },
  })

  // Expose the Vite server on the Fastify instance
  server.decorate('viteDevServer', viteDevServer)

  // Register as Express-like middleware
  await server.register(fastifyMiddie)
  server.use(viteDevServer.middlewares)
}

const viteDevServer = fastifyPlugin(viteDevServerPlugin, { name: 'vite-dev-server' })

export default viteDevServer
