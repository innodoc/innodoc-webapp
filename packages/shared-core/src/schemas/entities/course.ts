import z from 'zod'
import { localeSchema, slugSchema, translatableString } from '#schemas/common'
import { baseEntity } from './base.js'

/** Course object in the database */
const courseSchema = baseEntity
  .extend({
    slug: slugSchema.describe('Unique course slug'),
    title: translatableString.describe('Course title'),
    short_title: translatableString.nullable().describe('Course title (short)'),
    description: translatableString.nullable().describe('Course description'),
    home_link: z.string().describe('Course home link'),
    locales: z.array(localeSchema).describe('Course locales'),
    min_score: z.number().optional().describe('Minimal score a user has to achieve for a test to be passed'),
    logo: z.string().optional().describe('Course logo URL or identifier'),
  })
  .describe('Database course schema')

export { courseSchema }
