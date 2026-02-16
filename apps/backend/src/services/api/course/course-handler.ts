import z from 'zod'

import { courseSchema } from '@innodoc/shared-core/schemas/entities'
import { slugSchema } from '@innodoc/shared-core/schemas/common'

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
  const { courseSlug } = req.params

  const course = await this.db.getCourse(courseSlug)
  if (!course) {
    reply.callNotFound()
    return
  }

  await reply.send(course)
}

export default { schema, handler }
