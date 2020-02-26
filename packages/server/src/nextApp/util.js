const getContentPath = (prefix) => `/${prefix}/:contentId([A-Za-z0-9_/:-]+)`

const makeHandleCustomRoute = (app, dest) => (req, res) => {
  if (req.params.contentId.endsWith('/')) {
    res.redirect(req.path.slice(0, -1)) // remove trailing slash
  } else {
    app.render(req, res, dest, req.params)
  }
}

export { getContentPath, makeHandleCustomRoute }
