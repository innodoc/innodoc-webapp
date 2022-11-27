import { SLUG_REGEX } from '#constants'

export const API_PREFIX = '/api'
export const COURSE_PREFIX = '/course'
export const API_COURSE_PREFIX = `${API_PREFIX}${COURSE_PREFIX}`

/** Locale ISO-639-1 language code */
const LOCALE_REGEX = '[a-z]{2}'

/** Number regex */
const NUMBER_REGEX = '\\d+'

const routes: RoutesDefinition = {
  // Course
  'api/course': `${API_COURSE_PREFIX}/:courseId(${NUMBER_REGEX})`,

  // Page
  'api/course/pages': `${API_COURSE_PREFIX}/:courseId(${NUMBER_REGEX})/pages`,
  'api/course/page/content': `${API_COURSE_PREFIX}/:courseId(${NUMBER_REGEX})/page/:locale(${LOCALE_REGEX})/:pageId(${NUMBER_REGEX})`,

  // Section
  'api/course/sections': `${API_COURSE_PREFIX}/:courseId(${NUMBER_REGEX})/sections`,
  'api/course/section/content': `${API_COURSE_PREFIX}/:courseId(${NUMBER_REGEX})/section/:locale(${LOCALE_REGEX})/:sectionId(${NUMBER_REGEX})`,

  // Fragment
  'api/course/fragment/content': `${API_COURSE_PREFIX}/:courseId(${NUMBER_REGEX})/fragment/:locale(${LOCALE_REGEX})/:fragmentType(${SLUG_REGEX})`,
}

/** Route definition */
export type RoutesDefinition = Record<string, string>

export default routes
