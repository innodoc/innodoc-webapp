import z from 'zod'

import { baseEntity, locale, slug, translatableString } from './base'

/** Course object in the database */
const dbCourseSchema = baseEntity.extend({
  slug: slug.describe('Unique course slug'),
  title: translatableString.describe('Course title'),
  short_title: translatableString.nullable().describe('Course title (short)'),
  description: translatableString.nullable().describe('Course description'),
  home_link: z.string().describe('Course home link'),
  locales: z.array(locale).describe('Course locales'),
  min_score: z
    .number()
    .optional()
    .describe('Minimal score a user has to achieve for a test to be passed'),
  logo: z.string().optional().describe('Course logo URL or identifier'),
})

type DbCourseSchema = z.infer<typeof dbCourseSchema>

export type { DbCourseSchema }
export { dbCourseSchema }
