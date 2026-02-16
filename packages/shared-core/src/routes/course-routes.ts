import type { ApiPage, ApiSection } from '#schemas/types'

import type { RouteFuncArgs } from '#types'

const courseMiscRoutes = {
  // Course home
  'app:course:index': '/:courseSlug',

  // Progress
  'app:course:progress': '/:courseSlug/progress',

  // Table of contents
  'app:course:toc': '/:courseSlug/toc',

  // Glossary
  'app:course:glossary': '/:courseSlug/glossary',
}

const courseContentRoutes = {
  // Page
  'app:course:page': ({ pagePathPrefix }: RouteFuncArgs) => `/:courseSlug/${pagePathPrefix}/:pageSlug`,

  // Section
  'app:course:section': ({ sectionPathPrefix }: RouteFuncArgs) =>
    `/:courseSlug/${sectionPathPrefix}/:sectionPath([a-z0-9-/]*)`,
}

const courseRoutes = { ...courseMiscRoutes, ...courseContentRoutes }

interface CourseContentRouteParams {
  'app:course:page': {
    /** Page slug */
    pageSlug: ApiPage['slug']
  }
  'app:course:section': {
    /** Section path */
    sectionPath: ApiSection['path']
  }
}

export type { CourseContentRouteParams }
export { courseContentRoutes }
export default courseRoutes
