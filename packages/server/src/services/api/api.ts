import { validatorCompiler } from 'fastify-type-provider-zod'
import type { FastifyPluginAsync } from 'fastify'

import { API_PREFIX } from '@innodoc/constants'

import dbPlugin from '#plugins/db'

import camelcaseSerializerCompiler from './camelcaseSerializerCompiler'
import course from './course/course'
import fragment from './fragment/fragment'
import page from './page/page'
import section from './section/section'

const autoPrefix = API_PREFIX

const api: FastifyPluginAsync = async function (app) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(camelcaseSerializerCompiler)

  await app.register(dbPlugin)
  await app.register(course)
  await app.register(page)
  await app.register(section)
  await app.register(fragment)
}

export { autoPrefix }
export default api
