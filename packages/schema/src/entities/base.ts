import z from 'zod'

import { dbKey } from '#common'

const baseEntity = z.object({
  id: dbKey.describe('Primary key'),
  created_at: z.date().describe('Creation date (ISO8601)'),
  updated_at: z.date().describe('Update date (ISO8601)'),
})

type BaseEntitySchema = z.infer<typeof baseEntity>

export type { BaseEntitySchema }
export { baseEntity }
