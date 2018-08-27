import fs from 'fs'
import path from 'path'
import express from 'express'
import next from 'next'
import Dotenv from 'dotenv'
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
        const handle = app.getRequestHandler()

        // enable middleware for i18next
        server.use(i18nextMiddleware.handle(i18nInstance))

        // serve locales for client
        server.use('/locales', express.static(localesDir))

        // missing keys
        server.post('/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18nInstance))

        // a course section
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

        server.get('*', (req, res) => handle(req, res))

        console.info(`Starting ${nodeEnv} server on port ${port}.`)

        server.listen(port, (err) => {
          if (err) { throw err }
        })
      })
      .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
      })
  })
