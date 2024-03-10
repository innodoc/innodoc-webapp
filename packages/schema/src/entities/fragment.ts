import z from 'zod'

import { FRAGMENT_TYPES } from '@innodoc/constants'

const fragmentTypeSchema = z.enum(FRAGMENT_TYPES)

export { fragmentTypeSchema }
