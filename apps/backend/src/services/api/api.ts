import { validatorCompiler } from 'fastify-type-provider-zod'
import type { FastifyPluginAsync } from 'fastify'

import config from '@innodoc/config'

import dbPlugin from '#plugins/db'

import camelcaseSerializerCompiler from './camelcaseSerializerCompiler.js'
import course from './course/course.js'
import fragment from './fragment/fragment.js'
import page from './page/page.js'
import section from './section/section.js'

const api: FastifyPluginAsync = async function (app) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(camelcaseSerializerCompiler)

  if (!config.isProduction) {
    await app.register(import('#plugins/apiReference'))
  }

  await app.register(dbPlugin)
  await app.register(course)
  await app.register(page)
  await app.register(section)
  await app.register(fragment)
}

export default api
