import type { FastifyPluginAsync } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import scalarFastifyApiReference from '@scalar/fastify-api-reference'
import fastifyPlugin from 'fastify-plugin'
import { jsonSchemaTransform, validatorCompiler } from 'fastify-type-provider-zod'
import camelcaseSerializerCompiler from './camelcase.js'
import course from './course/course.js'
import fragment from './fragment/fragment.js'
import page from './page/page.js'
import section from './section/section.js'

const apiPluginCb: FastifyPluginAsync = async (server) => {
  const config = server.diContainer.resolve('config')

  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(camelcaseSerializerCompiler)

  if (!config.isProduction) {
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

  await server.register(course)
  await server.register(page)
  await server.register(section)
  await server.register(fragment)
}

const apiPlugin = fastifyPlugin(apiPluginCb, { name: 'api' })

export default apiPlugin
