import type { FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { validatorCompiler } from 'fastify-type-provider-zod'
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
    // Dev-only: dynamically imported so the devDependencies are never loaded in production
    const { default: swaggerPlugin } = await import('./swagger-dev-plugin.js')
    await server.register(swaggerPlugin)
  }

  await server.register(course)
  await server.register(page)
  await server.register(section)
  await server.register(fragment)
}

const apiPlugin = fastifyPlugin(apiPluginCb, { name: 'api' })

export default apiPlugin
