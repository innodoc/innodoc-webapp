const fs = require('fs')

const path = require('path')
const express = require('express')
const next = require('next')
const Dotenv = require('dotenv-safe')
const i18nextMiddleware = require('i18next-express-middleware')
const i18nNodeFsBackend = require('i18next-node-fs-backend')

const i18n = require('../src/lib/i18n')
const i18nOptions = require('../src/lib/i18n/options')

// directories
const rootDir = `${__dirname}/..`
const srcDir = `${rootDir}/src`
const localesDir = `${srcDir}/static/locales`

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

// create next.js app
const app = next({
  dir: srcDir,
  dev: nodeEnv === 'development',
})

const i18nServerOptions = {
  ...i18nOptions,
  preload: ['en'],
  detection: {
    order: ['cookie', 'header'],
    caches: ['cookie'],
  },
  backend: {
    loadPath: `${localesDir}/{{lng}}/{{ns}}.json`,
    addPath: `${localesDir}/{{lng}}/{{ns}}.missing.json`,
  },
}

// init i18next with serverside settings
i18n
  .use(i18nNodeFsBackend)
  .use(i18nextMiddleware.LanguageDetector);

(async () => {
  await i18n.init(i18nServerOptions)
  await app.prepare()
  const server = express()

  // pass env config into app
  server.use((req, res, _next) => {
    res.locals.contentRoot = contentRoot
    res.locals.staticRoot = staticRoot
    _next()
  })

  // enable middleware for i18next
  server.use(i18nextMiddleware.handle(i18n))
  if (nodeEnv !== 'production') {
    // auto-create missing translation keys in dev
    server.post('/static/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18n))
  }

  // serve a course section
  server.get('/page/:sectionId([A-Za-z0-9_/:-]+)', (req, res) => {
    if (req.params.sectionId.endsWith('/')) {
      res.redirect(req.path.slice(0, -1)) // remove trailing slash
    } else {
      app.render(req, res, '/page', req.params)
    }
  })

  // everything else handled by next.js app
  server.get('*', app.getRequestHandler())

  await server.listen(port)
  console.info(`Started ${nodeEnv} server on port ${port}.`)
})()
