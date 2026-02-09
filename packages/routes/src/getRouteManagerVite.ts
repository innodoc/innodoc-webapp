import { isCourseSlugMode } from '@innodoc/typeguards/common'

import RouteManager from './RouteManager.js'

let instance: RouteManager | undefined

/** Return `RouteManager` singleton (vite) */
function getRouteManagerVite() {
  if (!instance) {
    if (!isCourseSlugMode(import.meta.env.INNODOC_COURSE_SLUG_MODE)) {
      throw new Error(`Invalid course slug mode: ${import.meta.env.INNODOC_COURSE_SLUG_MODE}`)
    }

    instance = new RouteManager({
      config: {
        courseSlugMode: import.meta.env.INNODOC_COURSE_SLUG_MODE,
        pagePathPrefix: import.meta.env.INNODOC_PAGE_PATH_PREFIX,
        sectionPathPrefix: import.meta.env.INNODOC_SECTION_PATH_PREFIX,
      },
    })
  }

  return instance
}

export default getRouteManagerVite
