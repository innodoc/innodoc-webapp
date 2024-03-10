import type { LanguageCode } from 'iso-639-1'

import type Database from '@innodoc/database'
import type { CourseSchema, QuerySectionSchema, SectionSchema } from '@innodoc/schema/types'

import { unpackId, unpackValue } from './utils'
import type { IdResult, ValueResult } from './types'

/**
 * Get course sections by course ID.
 *
 * @param courseSlug Course slug
 * @returns Array of course sections
 */
export function getCourseSections(this: Database, courseSlug: CourseSchema['slug']): Promise<QuerySectionSchema[]> {
  if (!this.knex) {
    throw new Error('Database not initialized')
  }
  const { knex } = this

  return knex
    .withRecursive(
      'cte',
      ['id', 'slug', 'path', 'course_id', 'type', 'parent_id', 'order', 'created_at', 'updated_at'],
      (qb) => {
        void qb
          // Start with root nodes
          .select(
            's.id',
            's.slug',
            knex.raw('s.slug::varchar'),
            's.course_id',
            's.type',
            's.parent_id',
            knex.raw('array[s.order]::integer[]'),
            's.created_at',
            's.updated_at',
          )
          .from('sections as s')
          .join('courses as c', 's.course_id', 'c.id')
          .where('s.parent_id', null)
          .where('c.slug', courseSlug)
          .union((qb) => {
            // Add one level of children on each iteration
            void qb
              .select(
                's.id',
                's.slug',
                knex.raw("cte.path || '/' || s.slug"),
                's.course_id',
                's.type',
                's.parent_id',
                knex.raw('cte.order || s.order'),
                's.created_at',
                's.updated_at',
              )
              .from('sections as s')
              .join('cte', 'cte.id', 's.parent_id')
          })
      },
    )
    .select(
      'cte.id',
      'cte.slug',
      'cte.path',
      'cte.course_id',
      'cte.type',
      'cte.parent_id',
      'cte.order',
      'cte.created_at',
      'cte.updated_at',
      knex.raw('json_object_agg(t.locale, t.value) as title'),
      knex.raw('json_object_agg(st.locale, st.value) filter (where st.locale is not null) as short_title'),
    )
    .from('cte')
    .join('sections_title_trans as t', 'cte.id', 't.section_id')
    .leftOuterJoin('sections_short_title_trans as st', 'cte.id', 'st.section_id')
    .groupBy(
      'cte.id',
      'cte.slug',
      'cte.path',
      'cte.course_id',
      'cte.type',
      'cte.parent_id',
      'cte.order',
      'cte.created_at',
      'cte.updated_at',
    )
    .orderBy('cte.order')
}

/**
 * Get section ID by path.
 *
 * @param courseSlug Course slug
 * @param sectionPath Section path
 * @returns Section ID
 */
export async function getSectionIdByPath(
  this: Database,
  courseSlug: CourseSchema['slug'],
  sectionPath: SectionSchema['path'],
) {
  if (!this.knex) {
    throw new Error('Database not initialized')
  }
  const { knex } = this

  const pathParts = sectionPath.split('/')
  const rootSlug = pathParts.shift()

  const initialPartsArrRaw = knex.raw('array[' + pathParts.map(() => '?').join(',') + ']::varchar[]', pathParts)

  // Walk down tree along section path
  const result = await knex
    .withRecursive('cte', ['id', 'path'], (qb) => {
      void qb
        // Start with root node
        .select('s.id', initialPartsArrRaw)
        .from('sections as s')
        .join('courses as c', 's.course_id', 'c.id')
        .where('s.parent_id', null)
        .where('s.slug', rootSlug)
        .where('c.slug', courseSlug)
        .union((qb) => {
          // Find next child on each iteration, consuming next path part
          void qb
            .select(
              's.id',
              knex.raw('cte.path[2:]'), // Pass along parts removing 1st element
            )
            .from('sections as s')
            .join('cte', 'cte.id', 's.parent_id')
            .where('s.slug', knex.raw('cte.path[1]'))
        })
    })
    .first<IdResult | undefined>('cte.id')
    .from('cte')
    .where('cte.path', knex.raw('array[]::varchar[]'))

  return unpackId(result)
}

/**
 * Get localized section content.
 *
 * @param courseSlug Course slug
 * @param locale Content locale
 * @param sectionId Section ID
 * @returns Localized section content
 */
export async function getSectionContent(
  this: Database,
  courseSlug: CourseSchema['slug'],
  locale: LanguageCode,
  sectionId: SectionSchema['id'],
): Promise<string | undefined> {
  if (!this.knex) {
    throw new Error('Database not initialized')
  }

  const result = await this.knex
    .first<ValueResult<string>>('ct.value')
    .from('sections as s')
    .join('courses as c', 's.course_id', 'c.id')
    .leftOuterJoin('sections_content_trans as ct', 's.id', 'ct.section_id')
    .where('s.id', sectionId)
    .where('c.slug', courseSlug)
    .where('ct.locale', locale)

  return unpackValue(result)
}
