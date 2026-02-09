import type { LanguageCode } from 'iso-639-1'

import type { CourseSchema, FragmentTypeSchema } from '@innodoc/schema/types'

import type Database from '#database'

import { unpackValue } from './utils.js'
import type { ValueResult } from './types.js'

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
  if (!this._knex) {
    throw new Error('Database not initialized')
  }

  const result = await this._knex
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
