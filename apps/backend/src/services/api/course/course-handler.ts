import z from 'zod'

import { courseSchema, slugSchema } from '@innodoc/shared-core/schemas'

import { errorResponseSchema } from '#api/errors'
import type { ApiRouteHandlerMethod } from '#services/api/types'

const schema = {
  params: z.object({
    courseSlug: slugSchema.describe('Course slug'),
  }),
  response: {
    200: courseSchema.describe('Success'),
    400: errorResponseSchema(400, 'Bad Request'),
    404: errorResponseSchema(404, 'Course not found'),
  },
}

const handler: ApiRouteHandlerMethod<typeof schema> = async function (req, reply) {
  const db = req.diScope.resolve('database')
  const { courseSlug } = req.params

  const course = await db.getCourse(courseSlug)
  if (!course) {
    reply.callNotFound()
    return
  }

  await reply.send(course)
}

export default { schema, handler }
