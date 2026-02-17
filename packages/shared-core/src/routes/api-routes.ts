import type { LanguageCode } from 'iso-639-1'

import type { ApiCourse, ApiPage, ApiSection, FragmentTypeSchema } from '#types'

const apiRoutes = {
  // Course
  'api:course': '/:courseSlug',

  // Page
  'api:course:pages': '/:courseSlug/pages',
  'api:course:page:content': '/:courseSlug/pages/:locale/:pageSlug',

  // Section
  'api:course:sections': '/:courseSlug/sections',
  'api:course:section:content': '/:courseSlug/sections/:locale/:sectionPath([a-z0-9-/]*)',

  // Fragment
  'api:course:fragment:content': '/:courseSlug/fragments/:locale/:fragmentType',
}

interface ApiRouteParams {
  'api:course': { courseSlug: ApiCourse['slug'] }
  'api:course:pages': { courseSlug: ApiCourse['slug'] }
  'api:course:page:content': {
    courseSlug: ApiCourse['slug']
    locale: LanguageCode
    pageSlug: ApiPage['slug']
  }
  'api:course:sections': { courseSlug: ApiCourse['slug'] }
  'api:course:section:content': {
    courseSlug: ApiCourse['slug']
    locale: LanguageCode
    sectionPath: ApiSection['path']
  }
  'api:course:fragment:content': {
    courseSlug: ApiCourse['slug']
    locale: LanguageCode
    fragmentType: FragmentTypeSchema
  }
}

export type { ApiRouteParams }
export default apiRoutes
