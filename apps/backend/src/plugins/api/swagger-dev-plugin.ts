import type { FastifyPluginAsync } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import scalarFastifyApiReference from '@scalar/fastify-api-reference'
import fastifyPlugin from 'fastify-plugin'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

const swaggerPluginCb: FastifyPluginAsync = async (server) => {
  await server.register(fastifySwagger, {
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

  await server.register(scalarFastifyApiReference, { routePrefix: '/api-reference' })
}

const swaggerPlugin = fastifyPlugin(swaggerPluginCb, { name: 'swagger' })

export default swaggerPlugin
