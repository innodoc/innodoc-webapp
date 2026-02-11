import z from 'zod'
import type { LanguageCode } from 'iso-639-1'

import { localeSchema, sectionPathSchema, slugSchema } from '@innodoc/schema/common'

import { errorResponseSchema } from '#api/errors'
import type { ApiRouteHandlerMethod } from '#services/api/types'

const schema = {
  params: z.object({
    courseSlug: slugSchema.describe('Course slug'),
    locale: localeSchema.describe('Locale'),
    sectionPath: sectionPathSchema.describe('Section path'),
  }),
  response: {
    200: z.string().describe('Success'),
    400: errorResponseSchema(400, 'Bad Request'),
    404: errorResponseSchema(404, 'Section not found'),
  },
}

const handler: ApiRouteHandlerMethod<typeof schema> = async function (req, reply) {
  const { courseSlug, locale, sectionPath } = req.params

  const sectionId = await this.db.getSectionIdByPath(courseSlug, sectionPath)
  if (!sectionId) {
    reply.callNotFound()
    return
  }

  const content = await this.db.getSectionContent(courseSlug, locale as LanguageCode, sectionId)
  if (!content) {
    reply.callNotFound()
    return
  }

  await reply.send(content)
}

export default { schema, handler }
