const makePassConfigMiddleware = ({
  contentRoot,
  staticRoot,
  sectionPathPrefix,
  pagePathPrefix,
}) => (req, res, _next) => {
  res.locals.contentRoot = contentRoot
  res.locals.staticRoot = staticRoot
  res.locals.sectionPathPrefix = sectionPathPrefix
  res.locals.pagePathPrefix = pagePathPrefix
  _next()
}

export default makePassConfigMiddleware