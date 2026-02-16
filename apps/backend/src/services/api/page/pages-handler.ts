import z from 'zod'

import { pageSchema } from '@innodoc/shared-core/schemas/entities'
import { slugSchema } from '@innodoc/shared-core/schemas/common'

import { errorResponseSchema } from '#api/errors'
import type { ApiRouteHandlerMethod } from '#services/api/types'

const schema = {
  params: z.object({
    courseSlug: slugSchema.describe('Course slug'),
  }),
  response: {
    200: z.array(pageSchema).describe('Success'),
    400: errorResponseSchema(400, 'Bad Request'),
  },
}

const handler: ApiRouteHandlerMethod<typeof schema> = async function (req, reply) {
  const pages = await this.db.getCoursePages(req.params.courseSlug)
  await reply.send(pages)
}

export default { schema, handler }
