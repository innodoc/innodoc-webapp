import { SLUG_RE } from '#constants'

export const API_PREFIX = '/api'
export const COURSE_PREFIX = '/course'
export const API_COURSE_PREFIX = `${API_PREFIX}${COURSE_PREFIX}`

/** Locale ISO-639-1 language code */
const LOCALE_RE = '[a-z]{2}'

/** Number regex */
const NUMBER_RE = '\\d+'

const routes = {
  // Course
  'api/course': `${API_COURSE_PREFIX}/:courseId(${NUMBER_RE})`,

  // Page
  'api/course/pages': `${API_COURSE_PREFIX}/:courseId(${NUMBER_RE})/pages`,
  'api/course/page/content': `${API_COURSE_PREFIX}/:courseId(${NUMBER_RE})/page/:locale(${LOCALE_RE})/:pageId(${NUMBER_RE})`,

  // Section
  'api/course/sections': `${API_COURSE_PREFIX}/:courseId(${NUMBER_RE})/sections`,
  'api/course/section/content': `${API_COURSE_PREFIX}/:courseId(${NUMBER_RE})/section/:locale(${LOCALE_RE})/:sectionId(${NUMBER_RE})`,

  // Fragment
  'api/course/fragment/content': `${API_COURSE_PREFIX}/:courseId(${NUMBER_RE})/fragment/:locale(${LOCALE_RE})/:fragmentType(${SLUG_RE})`,
}

export type RouteName = keyof typeof routes

export default routes
