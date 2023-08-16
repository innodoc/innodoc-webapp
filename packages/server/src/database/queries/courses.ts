import camelcaseKeys from 'camelcase-keys'
import type { ApiCourse, DbCourse } from '@innodoc/types/entities'

import getDatabase from '#database'

/** Get course by ID */
export async function getCourse(courseSlug: DbCourse['slug']): Promise<ApiCourse | undefined> {
  const db = getDatabase()
  const result = await db
    .first<DbCourse | undefined>(
      'c.*',
      db.raw('array_to_json(c.locales) as locales'),
      db.raw('json_object_agg(t.locale, t.value) filter (where t.locale is not null) as title'),
      db.raw(
        'json_object_agg(st.locale, st.value) filter (where st.locale is not null) as short_title'
      ),
      db.raw(
        'json_object_agg(d.locale, d.value) filter (where d.locale is not null) as description'
      )
    )
    .from('courses as c')
    .leftOuterJoin('courses_title_trans as t', 'c.id', 't.course_id')
    .leftOuterJoin('courses_short_title_trans as st', 'c.id', 'st.course_id')
    .leftOuterJoin('courses_description_trans as d', 'c.id', 'd.course_id')
    .where({ 'c.slug': courseSlug })
    .groupBy('c.id')

  return result ? camelcaseKeys(result) : undefined
}
