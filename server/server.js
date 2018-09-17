import fs from 'fs'
import path from 'path'
import express from 'express'
import next from 'next'
import Dotenv from 'dotenv-safe'
import i18nextMiddleware, { LanguageDetector } from 'i18next-express-middleware'
import Backend from 'i18next-node-fs-backend'

import { i18nInstance } from '../src/lib/i18n'

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

// init i18next with serverside settings
// using i18next-express-middleware
i18nInstance
  .use(Backend)
  .use(LanguageDetector)
  .init({
    detection: {
      order: ['cookie', 'header'],
    },
    fallbackLng: 'en',
    preload: ['en', 'de'], // preload all langages
    ns: ['common'], // need to preload all the namespaces
    backend: {
      loadPath: `${localesDir}/{{lng}}/{{ns}}.json`,
      addPath: `${localesDir}/{{lng}}/{{ns}}.missing.json`,
    },
  }, () => {
    // loaded translations we can bootstrap our routes
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
        server.use(i18nextMiddleware.handle(i18nInstance))

        // serve locales for client
        server.use('/locales', express.static(localesDir))

        // missing keys
        if (nodeEnv !== 'production') {
          server.post('/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18nInstance))
        }

        // a course section
        server.get(/^\/page\/([A-Za-z0-9_/:-]+)$/, (req, res) => {
          const sectionPath = req.params[0]
          if (sectionPath.endsWith('/')) {
            // remove trailing slash
            res.redirect(req.path.slice(0, -1))
          }
          const actualPage = '/page'
          const queryParams = { sectionPath }
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
