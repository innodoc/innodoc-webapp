import express from 'express'
import next from 'next'
import nextI18NextMiddleware from 'next-i18next/middleware'

import nextI18next from '@innodoc/client-misc/src/i18n'

const handleCustomRoute = (app, dest) => (req, res) => {
  if (req.params.contentId.endsWith('/')) {
    res.redirect(req.path.slice(0, -1)) // remove trailing slash
  } else {
    app.render(req, res, dest, req.params)
  }
}

const getContentPath = (prefix) => `/${prefix}/:contentId([A-Za-z0-9_/:-]+)`

const startServer = async (srcDir, port, staticRoot, contentRoot, nodeEnv) => {
  const app = next({
    dir: srcDir,
    dev: nodeEnv === 'development',
  })
  await app.prepare()
  await express()
    // enable middleware for i18next
    .use(nextI18NextMiddleware(nextI18next))
    // pass config into app
    .use((req, res, _next) => {
      res.locals.contentRoot = contentRoot
      res.locals.staticRoot = staticRoot
      res.locals.sectionPathPrefix = process.env.SECTION_PATH_PREFIX
      res.locals.pagePathPrefix = process.env.PAGE_PATH_PREFIX
      _next()
    })
    .get(
      getContentPath(process.env.SECTION_PATH_PREFIX),
      handleCustomRoute(app, '/section')
    )
    .get(
      getContentPath(process.env.PAGE_PATH_PREFIX),
      handleCustomRoute(app, '/page')
    )
    // everything else handled by next.js app
    .get('*', app.getRequestHandler())
    .listen(port)
  console.info(`Started ${nodeEnv} server on port ${port}.`)
}

export default startServer
