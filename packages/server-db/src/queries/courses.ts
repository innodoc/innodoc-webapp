import type { Knex } from 'knex'
import type { CourseSchema } from '@innodoc/shared-core/types'

/**
 * Get course by slug.
 *
 * @param knex Knex instance
 * @param courseSlug Course slug
 * @returns Course object
 */
function getCourse(knex: Knex, courseSlug: CourseSchema['slug']): Promise<CourseSchema | undefined> {
  const columns = [
    'c.*',
    knex.raw('array_to_json(c.locales) as locales'),
    knex.raw('json_object_agg(t.locale, t.value) filter (where t.locale is not null) as title'),
    knex.raw('json_object_agg(st.locale, st.value) filter (where st.locale is not null) as short_title'),
    knex.raw('json_object_agg(d.locale, d.value) filter (where d.locale is not null) as description'),
  ]

  return knex
    .first<CourseSchema | undefined>(...columns)
    .from('courses as c')
    .leftOuterJoin('courses_title_trans as t', 'c.id', 't.course_id')
    .leftOuterJoin('courses_short_title_trans as st', 'c.id', 'st.course_id')
    .leftOuterJoin('courses_description_trans as d', 'c.id', 'd.course_id')
    .where({ 'c.slug': courseSlug })
    .groupBy('c.id')
}

export { getCourse }
