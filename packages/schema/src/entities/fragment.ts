import z from 'zod'

import { FRAGMENT_TYPES } from '@innodoc/constants'

const fragmentTypeSchema = z.enum(FRAGMENT_TYPES)

type FragmentTypeSchema = z.infer<typeof fragmentTypeSchema>

export type { FragmentTypeSchema }
export { fragmentTypeSchema }
