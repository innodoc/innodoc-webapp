import Fastify from 'fastify'

import type { ConfigSchema } from '@innodoc/shared-core/types'

import { diContainerPlugin, frontendPlugin, i18nPlugin, makeEnvPlugin } from './plugins/plugins.js'

/**
 * Creates the Fastify server with custom SSR integration.
 *
 * @param config - Application configuration schema
 * @returns Configured Fastify server instance
 */
async function makeServer(config: ConfigSchema) {
  const env = await makeEnvPlugin(config.isProduction)

  const server = Fastify(await env.options())
  await server.register(env.plugin)

  // Register DI container
  await server.register(diContainerPlugin, { config })

  // Register i18n
  await server.register(i18nPlugin, { config })

  // Register frontend
  await server.register(frontendPlugin, { config })

  if (!config.isProduction) {
    server.setErrorHandler((error, request, reply) => {
      const message = error instanceof Error ? error.message : String(error)
      const stack = error instanceof Error ? error.stack : undefined
      console.error(stack ?? message)
      reply.status(500).send({
        statusCode: 500,
        message,
        stack,
      })
    })
  }

  return server
}

export default makeServer
