import type { FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Get dev server certificates if available.
 *
 * @returns object containing certificates
 */
async function devCerts() {
  const certPath = path.resolve(import.meta.dirname, '..', '..', '..', 'cert')
  return {
    https: {
      allowHTTP1: true,
      key: await fs.readFile(path.join(certPath, 'key.pem')),
      cert: await fs.readFile(path.join(certPath, 'cert.pem')),
    },
  }
}

const options = async () => ({
  disableRequestLogging: true, // turn off globally (prevent vite dev server spamming)
  logger: {
    msgPrefix: '[HTTP] ',
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  ...(await devCerts()),
  http2: true,
})

// Development plugin - static file serving is handled by Vite dev server middleware
const devPlugin: FastifyPluginAsync = async () => {
  // No-op - Vite handles static files in dev mode
}

const plugin = fastifyPlugin(devPlugin, { name: 'dev' })

export { options, plugin }
