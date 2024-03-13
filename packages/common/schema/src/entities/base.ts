import z from 'zod'

import { dbKeySchema } from '#common'

const baseEntity = z.object({
  id: dbKeySchema.describe('Primary key'),
  created_at: z.date().describe('Creation date (ISO8601)'),
  updated_at: z.date().describe('Update date (ISO8601)'),
})

export { baseEntity }
