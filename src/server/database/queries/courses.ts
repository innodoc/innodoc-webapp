import camelcaseKeys from 'camelcase-keys'

import getDatabase from '#server/database/getDatabase'
import type { ApiCourse, DbCourse } from '#types/entities/course'

/** Get course by ID or slug */
export async function getCourse({
  courseId,
  courseSlug,
}: {
  courseId?: DbCourse['id']
  courseSlug?: DbCourse['slug']
}): Promise<ApiCourse | undefined> {
  let field
  let val

  if (courseId !== undefined) {
    field = 'c.id'
    val = courseId
  } else if (courseSlug !== undefined) {
    field = 'c.slug'
    val = courseSlug
  } else {
    throw new Error('getCourse() must receive either courseId or courseSlug')
  }

  const db = getDatabase()
  const result = await db
    .first<DbCourse | undefined>(
      'c.*',
      db.raw('array_to_json(c.locales) as locales'),
      db.raw('json_object_agg(t.locale, t.value) as title'),
      db.raw('json_object_agg(st.locale, st.value) as short_title'),
      db.raw('json_object_agg(d.locale, d.value) as description')
    )
    .from('courses as c')
    .join('courses_title_trans as t', 'c.id', 't.course_id')
    .join('courses_short_title_trans as st', 'c.id', 'st.course_id')
    .join('courses_description_trans as d', 'c.id', 'd.course_id')
    .where(field, val)
    .groupBy('c.id')

  return result ? camelcaseKeys(result) : undefined
}
