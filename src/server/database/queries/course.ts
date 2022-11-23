import type { LanguageCode } from 'iso-639-1'
import type { Root } from 'mdast'

import getDatabase from '#server/database/getDatabase'
import type { DbCourse, DbPage } from '#server/database/types'

function getCourse(name: DbCourse['name']) {
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

async function getCoursePages(name: DbCourse['name']) {
  const db = getDatabase()
  const pages = await db
    .select<DbPage[]>(
      'p.*',
      db.raw('array_to_json(p.linked) as linked'),
      db.raw('json_object_agg(t.locale, t.value) as title'),
      db.raw(
        // FILTER prevents null values being fed into aggregate function
        'json_object_agg(st.locale, st.value) FILTER (WHERE st.locale IS NOT NULL) as short_title'
      )
    )
    .from('pages as p')
    .join('courses as c', 'p.course_id', 'c.id')
    .join('pages_title_trans as t', 'p.id', 't.page_id')
    .leftOuterJoin('pages_short_title_trans as st', 'p.id', 'st.page_id')
    .where('c.name', name)
    .groupBy('p.id')

  // Fix course_id, short_title
  return pages.map((page) => ({
    ...page,
    course_id: undefined,
    short_title: page.short_title === null ? undefined : page.short_title,
  }))
}

async function getPageContent(
  courseName: DbCourse['name'],
  locale: LanguageCode,
  pageName: DbPage['name']
) {
  const db = getDatabase()
  const content = await db
    .first<{ value: Root } | undefined>('ct.value')
    .from('pages as p')
    .join('courses as c', 'p.course_id', 'c.id')
    .leftOuterJoin('pages_content_trans as ct', 'p.id', 'ct.page_id')
    .where('p.name', pageName)
    .where('c.name', courseName)
    .where('ct.locale', locale)

  return content !== undefined ? content.value : undefined
}

export { getCourse, getCoursePages, getPageContent }
