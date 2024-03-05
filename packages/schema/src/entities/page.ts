import z from 'zod'

import { PAGE_LINK_LOCACTIONS } from '@innodoc/constants'

import { dbKey, slugSchema, translatableString } from '#common'

import { baseEntity } from './base'

/** Page object in the database */
const pageSchema = baseEntity
  .extend({
    slug: slugSchema.describe('Page slug (unique within course)'),
    course_id: dbKey.describe('Course ID'),
    title: translatableString.describe('Page title'),
    short_title: translatableString.nullable().describe('Page title (short)'),
    icon: z.string().nullable().describe('Icon name'),
    linked: z
      .array(z.enum(PAGE_LINK_LOCACTIONS))
      .nullable()
      .describe('Location in the page layout where a link should appear'),
  })
  .describe('Database page schema')

type PageSchema = z.infer<typeof pageSchema>

export type { PageSchema }
export { pageSchema }
