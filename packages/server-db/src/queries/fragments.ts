import type { ValueResult } from './types.js'
import type { LanguageCode } from 'iso-639-1'
import type { Knex } from 'knex'
import type { CourseSchema, FragmentTypeSchema } from '@innodoc/shared-core/types'
import { unpackValue } from './utils.js'

/**
 * Get localized fragment content.
 *
 * @param knex Knex instance
 * @param courseSlug Course slug
 * @param locale Content locale
 * @param fragmentType Fragment type
 * @returns Localized fragment content
 */
async function getFragmentContent(
  knex: Knex,
  courseSlug: CourseSchema['slug'],
  locale: LanguageCode,
  fragmentType: FragmentTypeSchema,
): Promise<string | undefined> {
  const result = await knex
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
