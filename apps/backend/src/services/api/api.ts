import { validatorCompiler } from 'fastify-type-provider-zod'
import type { FastifyPluginAsync } from 'fastify'

import container from '@innodoc/container'

import dbPlugin from '#plugins/db'

import camelcaseSerializerCompiler from './camelcase.js'
import course from './course/course.js'
import fragment from './fragment/fragment.js'
import page from './page/page.js'
import section from './section/section.js'

const api: FastifyPluginAsync = async function (app) {
  const config = container.resolve('config')

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(camelcaseSerializerCompiler)

  if (!config.isProduction) {
    await app.register(import('#plugins/api-reference'))
  }

  await app.register(dbPlugin)
  await app.register(course)
  await app.register(page)
  await app.register(section)
  await app.register(fragment)
}

export default api
