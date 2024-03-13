import z from 'zod'

import { PAGE_LINK_LOCACTIONS } from '@innodoc/constants'

import { dbKeySchema, iconNameSchema, slugSchema, translatableString } from '#common'

import { baseEntity } from './base.js'

/** Page object in the database */
const pageSchema = baseEntity
  .extend({
    slug: slugSchema.describe('Page slug (unique within course)'),
    course_id: dbKeySchema.describe('Course ID'),
    title: translatableString.describe('Page title'),
    short_title: translatableString.nullable().describe('Page title (short)'),
    icon: iconNameSchema.nullable(),
    linked: z
      .array(z.enum(PAGE_LINK_LOCACTIONS))
      .nullable()
      .describe('Location in the page layout where a link should appear'),
  })
  .describe('Database page schema')

export { pageSchema }
