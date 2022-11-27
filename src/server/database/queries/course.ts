import type { LanguageCode } from 'iso-639-1'
import type { Root } from 'mdast'

import getDatabase from '#server/database/getDatabase'
import type { DbCourse } from '#types/entities/course'
import type { DbPage } from '#types/entities/page'
import type { DbSection } from '#types/entities/section'

function getCourse(name: DbCourse['name']): Promise<DbCourse> {
  const db = getDatabase()
  return db
    .first<DbCourse | null>(
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
    .where({ name })
    .groupBy('c.id')
}

function getCoursePages(name: DbCourse['name']): Promise<DbPage[]> {
  const db = getDatabase()
  return db
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
    .where('c.name', name)
    .groupBy('p.id')
}

async function getPageContent(
  courseName: DbCourse['name'],
  locale: LanguageCode,
  pageName: DbPage['name']
): Promise<Root | undefined> {
  const db = getDatabase()
  const result = await db
    .first<ContentResult>('ct.value')
    .from('pages as p')
    .join('courses as c', 'p.course_id', 'c.id')
    .leftOuterJoin('pages_content_trans as ct', 'p.id', 'ct.page_id')
    .where('p.name', pageName)
    .where('c.name', courseName)
    .where('ct.locale', locale)
  return result !== undefined ? result.value : undefined
}

function getCourseSections(courseName: DbCourse['name']): Promise<DbSection[]> {
  const db = getDatabase()
  return db
    .withRecursive(
      'cre',
      ['id', 'name', 'path', 'course_id', 'type', 'parent_id', 'order', 'created_at', 'updated_at'],
      (qb) => {
        void qb
          // Start with root node
          .select(
            's.id',
            's.name',
            db.raw('s.name::varchar'),
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
          .where('c.name', courseName)
          .union((qb) => {
            // Add one level of children on each iteration
            void qb
              .select(
                's.id',
                's.name',
                db.raw("cre.path || '/' || s.name"),
                's.course_id',
                's.type',
                's.parent_id',
                db.raw('cre.order || s.order'),
                's.created_at',
                's.updated_at'
              )
              .from('sections as s')
              .join('cre', 'cre.id', 's.parent_id')
          })
      }
    )
    .select(
      'cre.id',
      'cre.name',
      'cre.path',
      'cre.course_id',
      'cre.type',
      'cre.parent_id',
      'cre.order',
      'cre.created_at',
      'cre.updated_at',
      db.raw('json_object_agg(t.locale, t.value) as title'),
      db.raw(
        'json_object_agg(st.locale, st.value) filter (where st.locale is not null) as short_title'
      )
    )
    .from('cre')
    .join('sections_title_trans as t', 'cre.id', 't.section_id')
    .leftOuterJoin('sections_short_title_trans as st', 'cre.id', 'st.section_id')
    .groupBy(
      'cre.id',
      'cre.name',
      'cre.path',
      'cre.course_id',
      'cre.type',
      'cre.parent_id',
      'cre.order',
      'cre.created_at',
      'cre.updated_at'
    )
    .orderBy('cre.order') as Promise<DbSection[]>
}

async function getSectionContent(
  courseName: DbCourse['name'],
  locale: LanguageCode,
  sectionId: DbSection['id']
): Promise<Root | undefined> {
  const db = getDatabase()
  const result = await db
    .first<{ value: Root } | undefined>('ct.value')
    .from('sections as s')
    .join('courses as c', 's.course_id', 'c.id')
    .leftOuterJoin('sections_content_trans as ct', 's.id', 'ct.section_id')
    .where('s.id', sectionId)
    .where('c.name', courseName)
    .where('ct.locale', locale)

  return result !== undefined ? result.value : undefined
}

async function getFragmentContent(
  courseName: DbCourse['name'],
  locale: LanguageCode,
  fragmentName: string
): Promise<Root | undefined> {
  const db = getDatabase()
  const result = await db
    .first<{ value: Root } | undefined>('ct.value')
    .from('fragments as f')
    .join('courses as c', 'f.course_id', 'c.id')
    .leftOuterJoin('fragments_content_trans as ct', 'f.id', 'ct.section_id')
    .where('f.name', fragmentName)
    .where('c.name', courseName)
    .where('ct.locale', locale)

  return result !== undefined ? result.value : undefined
}

type ContentResult = { value: Root } | undefined

export {
  getCourse,
  getCoursePages,
  getFragmentContent,
  getPageContent,
  getCourseSections,
  getSectionContent,
}
