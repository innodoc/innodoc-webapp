import { validatorCompiler } from 'fastify-type-provider-zod'
import type { FastifyPluginAsync } from 'fastify'

import config from '@innodoc/config'

import dbPlugin from '#plugins/db'

import camelcaseSerializerCompiler from './camelcaseSerializerCompiler'
import course from './course/course'
import fragment from './fragment/fragment'
import page from './page/page'
import section from './section/section'

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
