import z from 'zod'
import { querySectionSchema, slugSchema } from '@innodoc/shared-core/schemas'
import { errorResponseSchema } from '#api/errors'
import type { ApiRouteHandlerMethod } from '#api/types'

const schema = {
  params: z.object({
    courseSlug: slugSchema.describe('Course slug'),
  }),
  response: {
    200: z.array(querySectionSchema).describe('Success'),
    400: errorResponseSchema(400, 'Bad Request'),
  },
}

const handler: ApiRouteHandlerMethod<typeof schema> = async function (req, reply) {
  const db = req.diScope.resolve('database')

  const sections = await db.getCourseSections(req.params.courseSlug)
  await reply.send(sections)
}

export default { schema, handler }
