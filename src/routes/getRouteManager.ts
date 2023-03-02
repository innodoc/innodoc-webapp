import RouteManager from './RouteManager'

function getRouteManager() {
  return RouteManager.getInstance(
    import.meta.env.INNODOC_COURSE_SLUG_MODE,
    import.meta.env.INNODOC_PAGE_PATH_PREFIX,
    import.meta.env.INNODOC_SECTION_PATH_PREFIX
  )
}

export default getRouteManager
