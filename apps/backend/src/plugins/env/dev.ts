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
      // Node's HTTP/2 sessions cap their memory use (streams, HPACK tables, header blocks
      // of open streams, queued send data) at `maxSessionMemory`, defaulting to 10 MB.
      // A dev page load opens ~200 module streams concurrently while Vite transforms
      // block the event loop, which pushes session memory past the default; Node then
      // resets new streams with ENHANCE_YOUR_CALM, which the browser surfaces as
      // `ERR_HTTP2_PROTOCOL_ERROR` and leaves the app partially hydrated. A single page
      // load peaks between 16 and 32 MB, so 64 MB leaves headroom for larger content.
      maxSessionMemory: 64,
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
