import type Database from '@innodoc/database'
import type { CourseSchema } from '@innodoc/schema/types'

/**
 * Get course by slug.
 *
 * @param courseSlug Course slug
 * @returns Course object
 */
function getCourse(this: Database, courseSlug: CourseSchema['slug']): Promise<CourseSchema | undefined> {
  if (!this.knex) {
    throw new Error('Database not initialized')
  }

  const columns = [
    'c.*',
    this.knex.raw('array_to_json(c.locales) as locales'),
    this.knex.raw('json_object_agg(t.locale, t.value) filter (where t.locale is not null) as title'),
    this.knex.raw('json_object_agg(st.locale, st.value) filter (where st.locale is not null) as short_title'),
    this.knex.raw('json_object_agg(d.locale, d.value) filter (where d.locale is not null) as description'),
  ]

  return this.knex
    .first<CourseSchema | undefined>(...columns)
    .from('courses as c')
    .leftOuterJoin('courses_title_trans as t', 'c.id', 't.course_id')
    .leftOuterJoin('courses_short_title_trans as st', 'c.id', 'st.course_id')
    .leftOuterJoin('courses_description_trans as d', 'c.id', 'd.course_id')
    .where({ 'c.slug': courseSlug })
    .groupBy('c.id')
}

export { getCourse }
