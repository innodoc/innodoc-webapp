const fs = require('fs')
const path = require('path')

const Dotenv = require('dotenv-safe')
const express = require('express')
const next = require('next')
const nextI18NextMiddleware = require('next-i18next/middleware').default

const nextI18next = require('@innodoc/client-misc/src/i18n')

// directories
const rootDir = path.resolve(__dirname, '..', '..', '..')
const srcDir = path.resolve(rootDir, 'packages', 'client-web', 'src')

// load configuration
const dotEnvFile = path.resolve(rootDir, '.env')
if (!fs.existsSync(dotEnvFile)) {
  console.error(`Could not find configuration file '${dotEnvFile}'`)
  console.error("Copy '.env.example' to '.env' and edit to your liking.")
  process.exit(1)
}
Dotenv.config({
  path: dotEnvFile,
  example: path.resolve(rootDir, '.env.example'),
})

let nodeEnv
let portVarName
if (process.env.NODE_ENV === 'production') {
  nodeEnv = 'production'
  portVarName = 'PROD_PORT'
} else {
  nodeEnv = 'development'
  portVarName = 'DEV_PORT'
}
const port = process.env[portVarName]
if (!port) {
  throw new Error(`You need to configure ${portVarName} in your .env file!`)
}

// ensure trailing slash
const contentRoot = process.env.CONTENT_ROOT.substr(-1) === '/'
  ? process.env.CONTENT_ROOT
  : `${process.env.CONTENT_ROOT}/`

let staticRoot = process.env.STATIC_ROOT
  ? process.env.STATIC_ROOT
  : `${contentRoot}_static/`
staticRoot = staticRoot.substr(-1) === '/'
  ? staticRoot
  : `${staticRoot}/`

const handleCustomRoute = (app, dest) => (
  (req, res) => {
    if (req.params.contentId.endsWith('/')) {
      res.redirect(req.path.slice(0, -1)) // remove trailing slash
    } else {
      app.render(req, res, dest, req.params)
    }
  }
)

const idRegExp = '[A-Za-z0-9_/:-]+'

const startServer = async () => {
  try {
    const app = next({
      dir: srcDir,
      dev: nodeEnv === 'development',
    })
    await app.prepare()
    await express()
      // enable middleware for i18next
      .use(nextI18NextMiddleware(nextI18next))
      // pass env config into app
      .use((req, res, _next) => {
        res.locals.contentRoot = contentRoot
        res.locals.staticRoot = staticRoot
        _next()
      })
      .get(
        `/${process.env.SECTION_PATH_PREFIX}/:contentId(${idRegExp})`,
        handleCustomRoute(app, '/section')
      )
      .get(
        `/${process.env.PAGE_PATH_PREFIX}/:contentId(${idRegExp})`,
        handleCustomRoute(app, '/page')
      )
      // everything else handled by next.js app
      .get('*', app.getRequestHandler())
      .listen(port)
    console.info(`Started ${nodeEnv} server on port ${port}.`)
  } catch (e) {
    console.log(e)
    process.exit(2)
  }
}

startServer()
