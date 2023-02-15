import camelcaseKeys from 'camelcase-keys'
import type { LanguageCode } from 'iso-639-1'

import getDatabase from '#server/database/getDatabase'
import type { DbCourse } from '#types/entities/course'
import type { MarkdownDoc } from '#types/entities/markdown'
import type { ApiSection, DbQuerySection, DbSection } from '#types/entities/section'

import type { ResultFromValue, IdResult } from './types'

/** Get course sections by course ID */
export async function getCourseSections(courseId: DbCourse['id']): Promise<ApiSection[]> {
  const db = getDatabase()
  const result = (await db
    .withRecursive(
      'cte',
      ['id', 'slug', 'path', 'course_id', 'type', 'parent_id', 'order', 'created_at', 'updated_at'],
      (qb) => {
        void qb
          // Start with root nodes
          .select(
            's.id',
            's.slug',
            db.raw('s.slug::varchar'),
            's.course_id',
            's.type',
            's.parent_id',
            db.raw('array[s.order]::integer[]'),
            's.created_at',
            's.updated_at'
          )
          .from('sections as s')
          .join('courses as c', 's.course_id', 'c.id')
          .where('s.parent_id', null)
          .where('c.id', courseId)
          .union((qb) => {
            // Add one level of children on each iteration
            void qb
              .select(
                's.id',
                's.slug',
                db.raw("cte.path || '/' || s.slug"),
                's.course_id',
                's.type',
                's.parent_id',
                db.raw('cte.order || s.order'),
                's.created_at',
                's.updated_at'
              )
              .from('sections as s')
              .join('cte', 'cte.id', 's.parent_id')
          })
      }
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
      db.raw('json_object_agg(t.locale, t.value) as title'),
      db.raw(
        'json_object_agg(st.locale, st.value) filter (where st.locale is not null) as short_title'
      )
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
      'cte.updated_at'
    )
    .orderBy('cte.order')) as DbQuerySection[] // somehow passing type doesn't work here

  return camelcaseKeys(result)
}

/** Get section ID by path */
export async function getSectionIdByPath(courseId: DbCourse['id'], sectionPath: DbSection['path']) {
  const db = getDatabase()
  const pathParts = sectionPath.split('/')
  const rootSlug = pathParts.shift()

  const initialPartsArrRaw = db.raw(
    'array[' + pathParts.map(() => '?').join(',') + ']::varchar[]',
    pathParts
  )

  // Walk down tree along section path
  const result = await db
    .withRecursive('cte', ['id', 'path'], (qb) => {
      void qb
        // Start with root node
        .select('s.id', initialPartsArrRaw)
        .from('sections as s')
        .join('courses as c', 's.course_id', 'c.id')
        .where('s.parent_id', null)
        .where('s.slug', rootSlug)
        .where('c.id', courseId)
        .union((qb) => {
          // Find next child on each iteration, consuming next path part
          void qb
            .select(
              's.id',
              db.raw('cte.path[2:]') // Pass along parts removing 1st element
            )
            .from('sections as s')
            .join('cte', 'cte.id', 's.parent_id')
            .where('s.slug', db.raw('cte.path[1]'))
        })
    })
    .first<IdResult | undefined>('cte.id')
    .from('cte')
    .where('cte.path', db.raw('array[]::varchar[]'))

  return result?.id
}

/** Get section content */
export async function getSectionContent(
  courseId: DbCourse['id'],
  locale: LanguageCode,
  sectionId: DbSection['id']
): Promise<MarkdownDoc | undefined> {
  const db = getDatabase()
  const result = await db
    .first<ResultFromValue<MarkdownDoc>>('ct.value')
    .from('sections as s')
    .join('courses as c', 's.course_id', 'c.id')
    .leftOuterJoin('sections_content_trans as ct', 's.id', 'ct.section_id')
    .where('s.id', sectionId)
    .where('c.id', courseId)
    .where('ct.locale', locale)

  return result ? result.value : undefined
}
