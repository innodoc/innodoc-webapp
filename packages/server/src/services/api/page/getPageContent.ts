import z from 'zod'

import { localeSchema, slugSchema } from '@innodoc/schema/common'

import { errorResponseSchema } from '#api/errors'
import type { ApiRouteHandlerMethod } from '#services/api/types'

const schema = {
  params: z.object({
    courseSlug: slugSchema.describe('Course slug'),
    locale: localeSchema.describe('Locale'),
    pageSlug: slugSchema.describe('Page slug'),
  }),
  response: {
    200: z.string().describe('Success'),
    400: errorResponseSchema(400, 'Bad Request'),
    404: errorResponseSchema(404, 'Page not found'),
  },
}

const handler: ApiRouteHandlerMethod<typeof schema> = async function (req, reply) {
  const { courseSlug, locale, pageSlug } = req.params

  const content = await this.db.getPageContent(courseSlug, locale, pageSlug)
  if (!content) {
    reply.callNotFound()
    return
  }

  await reply.send(content)
}

export default { schema, handler }
