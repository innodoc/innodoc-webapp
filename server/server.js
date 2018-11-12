import fs from 'fs'
import path from 'path'
import express from 'express'
import next from 'next'
import Dotenv from 'dotenv-safe'
import i18nextMiddleware from 'i18next-express-middleware'
import i18nNodeFsBackend from 'i18next-node-fs-backend'

import i18n from '../src/lib/i18n/instance'
import i18nOptions from '../src/lib/i18n/options'

// directories
const rootDir = `${__dirname}/..`
const srcDir = `${rootDir}/src`
const localesDir = `${srcDir}/locales`

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

// create next.js app
const app = next({
  dir: srcDir,
  dev: nodeEnv === 'development',
})

const i18nServerOptions = {
  ...i18nOptions,
  preload: ['en', 'de'],
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
// using i18next-express-middleware
i18n
  .use(i18nNodeFsBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init(i18nServerOptions, () => {
    // loaded translations -> bootstrap routes
    app.prepare()
      .then(() => {
        const server = express()
        const appHandler = app.getRequestHandler()

        // set CONTENT_ROOT
        server.use((req, res, _next) => {
          res.locals.contentRoot = contentRoot
          _next()
        })

        // enable middleware for i18next
        server.use(i18nextMiddleware.handle(i18n))

        // serve locales to client
        server.use('/static/locales', express.static(localesDir))

        // auto-create missing translation keys in dev
        if (nodeEnv !== 'production') {
          server.post('/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18n))
        }

        // serve a course section
        server.get(/^\/page\/([A-Za-z0-9_/:-]+)$/, (req, res) => {
          const sectionId = req.params[0]
          if (sectionId.endsWith('/')) {
            // remove trailing slash
            res.redirect(req.path.slice(0, -1))
          }
          const actualPage = '/page'
          const queryParams = { sectionId }
          app.render(req, res, actualPage, queryParams)
        })

        // everything else handled by next.js app
        server.get('*', (req, res) => appHandler(req, res))

        server.listen(port, (err) => {
          if (err) { throw err }
          console.info(`Started ${nodeEnv} server on port ${port}.`)
        })
      })
      .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
      })
  })
