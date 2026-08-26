import type { FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

// Plain HTTP/1.1 as production setups are behind some reverse proxy anyways.
const options = () =>
  Promise.resolve({
    logger: false,
  })

// Production plugin - static file serving is handled by the frontend plugin
const prodPlugin: FastifyPluginAsync = async () => {
  // No-op - frontend plugin handles static files in prod mode
}

const plugin = fastifyPlugin(prodPlugin, { name: 'prod' })

export { options, plugin }
