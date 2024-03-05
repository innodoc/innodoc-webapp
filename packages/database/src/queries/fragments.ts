import type { LanguageCode } from 'iso-639-1'

import type Database from '@innodoc/database'
import type { CourseSchema, FragmentTypeSchema } from '@innodoc/schema'

import { unpackValue } from './utils'
import type { ValueResult } from './types'

/**
 * Get localized fragment content.
 *
 * @param courseSlug Course slug
 * @param locale Content locale
 * @param fragmentType Fragment type
 * @returns Localized fragment content
 */
async function getFragmentContent(
  this: Database,
  courseSlug: CourseSchema['slug'],
  locale: LanguageCode,
  fragmentType: FragmentTypeSchema,
): Promise<string | undefined> {
  if (!this.knex) {
    throw new Error('Database not initialized')
  }

  const result = await this.knex
    .first<ValueResult<string> | undefined>('ct.value')
    .from('fragments as f')
    .join('courses as c', 'f.course_id', 'c.id')
    .leftOuterJoin('fragments_content_trans as ct', 'f.id', 'ct.fragment_id')
    .where('f.type', fragmentType)
    .where('c.slug', courseSlug)
    .where('ct.locale', locale)

  return unpackValue(result)
}

export { getFragmentContent }
