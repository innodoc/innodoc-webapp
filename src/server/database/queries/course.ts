import type { LanguageCode } from 'iso-639-1'
import type { Root } from 'mdast'

import getDatabase from '#server/database/getDatabase'
import type { DbCourse, DbPage, DbSection } from '#server/database/types'

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

async function getCoursePages(name: DbCourse['name']): Promise<DbPage[]> {
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
    .where('c.name', name)
    .groupBy('p.id')

  // Fix short_title
  return result.map((page) => ({
    ...page,
    short_title: page.short_title === null ? undefined : page.short_title,
  }))
}

async function getPageContent(
  courseName: DbCourse['name'],
  locale: LanguageCode,
  pageName: DbPage['name']
): Promise<Root | undefined> {
  const db = getDatabase()
  const result = await db
    .first<{ value: Root } | undefined>('ct.value')
    .from('pages as p')
    .join('courses as c', 'p.course_id', 'c.id')
    .leftOuterJoin('pages_content_trans as ct', 'p.id', 'ct.page_id')
    .where('p.name', pageName)
    .where('c.name', courseName)
    .where('ct.locale', locale)

  return result !== undefined ? result.value : undefined
}

async function getCourseSections(name: DbCourse['name']): Promise<DbSection[]> {
  const db = getDatabase()
  const result = await db
    .select<DbSection[]>(
      's.id',
      's.course_id',
      's.type',
      's.path',
      's.created_at',
      's.updated_at',
      's.order',
      db.raw('s.order'),
      db.raw('json_object_agg(t.locale, t.value) as title'),
      db.raw(
        'json_object_agg(st.locale, st.value) filter (where st.locale is not null) as short_title'
      ),
      db.raw("nullif(subpath(s.path, 0, -1), '') as parent"),
      db.raw('array_agg(distinct ch.path::text) filter (where ch.id is not null) as children')
    )
    .from('sections as s')
    .join('courses as c', 's.course_id', 'c.id')
    .join('sections_title_trans as t', 's.id', 't.section_id')
    .leftOuterJoin('sections_short_title_trans as st', 's.id', 'st.section_id')
    .joinRaw("left outer join sections ch on ch.path ~ (s.path::text || '.*{1}')::lquery")
    .where('c.name', name)
    .orderBy('s.path', 'asc')
    .groupBy('s.id')

  // Fix short_title
  return result.map((section) => ({
    ...section,
    short_title: section.short_title === null ? undefined : section.short_title,
  }))
}

export { getCourse, getCoursePages, getPageContent, getCourseSections }
