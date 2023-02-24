import makeRoutes from './routes'

/** Return route manager */
function getRoutes() {
  return makeRoutes(
    import.meta.env.INNODOC_COURSE_SLUG_MODE,
    import.meta.env.INNODOC_PAGE_PATH_PREFIX,
    import.meta.env.INNODOC_SECTION_PATH_PREFIX
  )
}

export default getRoutes
