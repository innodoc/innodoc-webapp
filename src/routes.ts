import { LOCALE_REGEX, NAME_REGEX } from '#constants'

export const API_PREFIX = '/api'
export const COURSE_PREFIX = '/course'
export const API_COURSE_PREFIX = `${API_PREFIX}${COURSE_PREFIX}`

const routes: RoutesDefinition = {
  // Course
  'api/course': `${API_COURSE_PREFIX}/:courseName(${NAME_REGEX})`,

  // Page
  'api/course/pages': `${API_COURSE_PREFIX}/:courseName(${NAME_REGEX})/pages`,
  'api/course/page/content': `${API_COURSE_PREFIX}/:courseName(${NAME_REGEX})/page/:locale(${LOCALE_REGEX})/:pageName(${NAME_REGEX})`,

  // Section
  'api/course/sections': `${API_COURSE_PREFIX}/:courseName(${NAME_REGEX})/sections`,
  'api/course/section/content': `${API_COURSE_PREFIX}/:courseName(${NAME_REGEX})/section/:locale(${LOCALE_REGEX})/:sectionId(\\d+)`,

  // Fragment
  'api/course/fragment/content': `${API_COURSE_PREFIX}/:courseName(${NAME_REGEX})/fragment/:locale(${LOCALE_REGEX})/:fragmentName(${NAME_REGEX})`,
}

/** Route definition */
export type RoutesDefinition = Record<string, string>

export default routes
