import camelcaseKeys from 'camelcase-keys'
import type { ApiPage, DbCourse, DbPage } from '@innodoc/types/entities'
import type { LanguageCode } from 'iso-639-1'

import getDatabase from '#database'

import type { ResultFromValue } from './types'

/** Get course pages */
export async function getCoursePages(courseSlug: DbCourse['slug']): Promise<ApiPage[]> {
  const db = getDatabase()
  const result = await db
    .select<DbPage[]>(
      'p.*',
      db.raw('array_to_json(p.linked) as linked'),
      db.raw('json_object_agg(t.locale, t.value) as title'),
      db.raw(
        'json_object_agg(st.locale, st.value) filter (where st.locale is not null) as short_title'
      )
    )
    .from('pages as p')
    .join('courses as c', 'p.course_id', 'c.id')
    .join('pages_title_trans as t', 'p.id', 't.page_id')
    .leftOuterJoin('pages_short_title_trans as st', 'p.id', 'st.page_id')
    .where('c.slug', courseSlug)
    .groupBy('p.id')

  return camelcaseKeys(result)
}

/** Get page content */
export async function getPageContent(
  courseSlug: DbCourse['slug'],
  locale: LanguageCode,
  pageSlug: DbPage['slug']
): Promise<string | undefined> {
  const db = getDatabase()
  const result = await db
    .first<ResultFromValue<string>>('ct.value')
    .from('pages as p')
    .join('courses as c', 'p.course_id', 'c.id')
    .leftOuterJoin('pages_content_trans as ct', 'p.id', 'ct.page_id')
    .where('p.slug', pageSlug)
    .where('c.slug', courseSlug)
    .where('ct.locale', locale)

  return result ? result.value : undefined
}
