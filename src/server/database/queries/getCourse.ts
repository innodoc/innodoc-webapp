import getDatabase from '#server/database/getDatabase'
import type { DbCourse } from '#server/database/types'
import type { ApiCourse } from '#types/api'

async function getCourse(name: ApiCourse['name']) {
  const db = getDatabase()
  const course = await db<DbCourse>({ c: 'courses' })
    .join('courses_title_trans as t', 'c.id', 't.course_id')
    .join('courses_short_title_trans as st', 'c.id', 'st.course_id')
    .join('courses_description_trans as d', 'c.id', 'd.course_id')
    .select(
      'c.*',
      db.raw('array_to_json(c.locales) as locales'),
      db.raw('json_object_agg(t.locale, t.value) as title'),
      db.raw('json_object_agg(st.locale, st.value) as short_title'),
      db.raw('json_object_agg(d.locale, d.value) as description')
    )
    .where({ name })
    .groupBy('c.id')
  return course.length ? course : null
}

export default getCourse
