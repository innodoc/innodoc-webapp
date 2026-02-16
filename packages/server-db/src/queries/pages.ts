import type { LanguageCode } from 'iso-639-1'

import type { CourseSchema, PageSchema } from '@innodoc/shared-core/schemas/types'

import type Database from '#database'

import { unpackValue } from './utils.js'
import type { ValueResult } from './types.js'

/**
 * Get course pages.
 *
 * @param courseSlug Course slug
 * @returns Array of page objects
 */
export function getCoursePages(this: Database, courseSlug: CourseSchema['slug']): Promise<PageSchema[]> {
  if (!this._knex) {
    throw new Error('Database not initialized')
  }

  const columns = [
    'p.*',
    this._knex.raw('array_to_json(p.linked) as linked'),
    this._knex.raw('json_object_agg(t.locale, t.value) as title'),
    this._knex.raw('json_object_agg(st.locale, st.value) filter (where st.locale is not null) as short_title'),
  ]
  return this._knex
    .select<PageSchema[]>(...columns)
    .from('pages as p')
    .join('courses as c', 'p.course_id', 'c.id')
    .join('pages_title_trans as t', 'p.id', 't.page_id')
    .leftOuterJoin('pages_short_title_trans as st', 'p.id', 'st.page_id')
    .where('c.slug', courseSlug)
    .groupBy('p.id')
}

/**
 * Get localized page content.
 *
 * @param courseSlug Course slug
 * @param locale Content locale
 * @param pageSlug Page slug
 * @returns Localized page content
 */
export async function getPageContent(
  this: Database,
  courseSlug: CourseSchema['slug'],
  locale: LanguageCode,
  pageSlug: PageSchema['slug'],
): Promise<string | undefined> {
  if (!this._knex) {
    throw new Error('Database not initialized')
  }

  const result = await this._knex
    .first<ValueResult<string>>('ct.value')
    .from('pages as p')
    .join('courses as c', 'p.course_id', 'c.id')
    .leftOuterJoin('pages_content_trans as ct', 'p.id', 'ct.page_id')
    .where('p.slug', pageSlug)
    .where('c.slug', courseSlug)
    .where('ct.locale', locale)

  return unpackValue(result)
}
