import type { FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

const options = () =>
  Promise.resolve({
    http2: true,
    logger: false,
  })

// Production plugin - static file serving is handled by the frontend plugin
const prodPlugin: FastifyPluginAsync = async () => {
  // No-op — frontend plugin handles static files in prod mode
}

const plugin = fastifyPlugin(prodPlugin, { name: 'prod' })

export { options, plugin }
