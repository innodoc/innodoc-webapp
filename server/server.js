const fs = require('fs')
const path = require('path')

const Dotenv = require('dotenv-safe')
const express = require('express')
const next = require('next')
const nextI18NextMiddleware = require('next-i18next/middleware')

const nextI18next = require('../src/lib/i18n')

// directories
const rootDir = `${__dirname}/..`
const srcDir = `${rootDir}/src`

// load configuration
const dotEnvFile = path.normalize(`${rootDir}/.env`)
if (!fs.existsSync(dotEnvFile)) {
  console.error(`Could not find configuration file '${dotEnvFile}'`)
  console.error("Copy '.env.example' to '.env' and edit to your liking.")
  process.exit(1)
}
Dotenv.config({ path: dotEnvFile })

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

const startServer = async () => {
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
    // custom route for page.js
    .get('/page/:sectionId([A-Za-z0-9_/:-]+)', (req, res) => {
      if (req.params.sectionId.endsWith('/')) {
        res.redirect(req.path.slice(0, -1)) // remove trailing slash
      } else {
        app.render(req, res, '/page', req.params)
      }
    })
    // everything else handled by next.js app
    .get('*', app.getRequestHandler())
    .listen(port)
  console.info(`Started ${nodeEnv} server on port ${port}.`)
}

try {
  startServer()
} catch {
  console.error('Could not start server!')
  process.exit(2)
}
