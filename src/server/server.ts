import path from 'path'

import compression from 'compression'
import express from 'express'
import { renderPage } from 'vite-plugin-ssr'

const isProduction = process.env.NODE_ENV === 'production'
const rootDir = path.resolve(__dirname, '..', '..')

void startServer()

async function startServer() {
  const app = express()

  app.use(compression())

  if (isProduction) {
    const sirv = require('sirv')
    app.use(sirv(path.resolve(rootDir, '..', '..', 'dist')))
  } else {
    const vite = require('vite')

    const viteServer = await vite.createServer({
      root: rootDir,
      server: { middlewareMode: 'ssr' },
    })
    app.use(viteServer.middlewares)
  }

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const pageContextInit = { url }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType } = httpResponse
    res.status(statusCode).type(contentType).send(body)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
