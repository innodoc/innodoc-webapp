import z from 'zod'

import { fragmentTypeSchema } from '@innodoc/schema'
import { localeSchema, slugSchema } from '@innodoc/schema/common'

import { errorResponseSchema } from '#api/errors'
import type { ApiRouteHandlerMethod } from '#services/api/types'
import type { LanguageCode } from 'iso-639-1'

const schema = {
  params: z.object({
    courseSlug: slugSchema.describe('Course slug'),
    locale: localeSchema.describe('Locale'),
    fragmentType: fragmentTypeSchema.describe('Fragment type'),
  }),
  response: {
    200: z.string().describe('Success'),
    400: errorResponseSchema(400, 'Bad Request'),
    404: errorResponseSchema(404, 'Fragment not found'),
  },
}

const handler: ApiRouteHandlerMethod<typeof schema> = async function (req, reply) {
  const { courseSlug, locale, fragmentType } = req.params

  const content = await this.db.getFragmentContent(courseSlug, locale as LanguageCode, fragmentType)

  if (!content) {
    reply.callNotFound()
    return
  }

  await reply.send(content)
}

export default { schema, handler }
