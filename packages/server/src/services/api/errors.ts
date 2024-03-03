import z from 'zod'

const errorResponseSchema = (statusCode = 500, description = 'Error') =>
  z
    .object({
      statusCode: z.literal(statusCode),
      code: z.string(),
      error: z.string(),
      message: z.string(),
    })
    .describe(description)

export { errorResponseSchema }
