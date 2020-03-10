export const getContentPath = (prefix) =>
  `/${prefix}/:contentId([A-Za-z0-9_/:-]+)`

export const handleCustomRoute = (app, dest) => (req, res) => {
  if (req.params.contentId.endsWith('/')) {
    res.redirect(req.path.slice(0, -1)) // remove trailing slash
  } else {
    app.render(req, res, dest, req.params)
  }
}
