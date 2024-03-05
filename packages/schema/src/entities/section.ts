import z from 'zod'

import { SECTION_TYPES } from '@innodoc/constants'

import { dbKey, orderNumber, sectionPathSchema, translatableString } from '#common'

import { baseEntity } from './base'

/** Section object in the database */
const sectionSchema = baseEntity
  .extend({
    path: sectionPathSchema.describe('Section path'),
    course_id: dbKey.describe('Course ID'),
    parent_id: dbKey.describe('ID of parent section').nullable(),
    title: translatableString.describe('Page title'),
    short_title: translatableString.nullable().describe('Page title (short)'),
    type: z.array(z.enum(SECTION_TYPES)).nullable().describe('Section type'),
    order: orderNumber,
  })
  .describe('Database page schema')

/** Section object returned by database query. */
const querySectionSchema = sectionSchema.extend({
  order: z
    .array(orderNumber)
    .describe('Array of section orders from the root section up to this section'),
})

// /** Section tree with chldren (used by Toc components) */
// interface SectionWithChildren extends TranslatedSection {
//   children: SectionWithChildren[]
// }

type SectionSchema = z.infer<typeof sectionSchema>
type QuerySectionSchema = z.infer<typeof querySectionSchema>

export type { QuerySectionSchema, SectionSchema }
export { querySectionSchema, sectionSchema }
