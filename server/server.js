import express from 'express'
import next from 'next'
import Dotenv from 'dotenv'
import i18nextMiddleware, { LanguageDetector } from 'i18next-express-middleware'
import Backend from 'i18next-node-fs-backend'

import { i18nInstance } from '../src/i18n'

const srcDir = `${__dirname}/../src`
const localesDir = `${srcDir}/locales`
const dev = process.env.NODE_ENV !== 'production'
const app = next({
  dir: srcDir,
  dev,
})
const handle = app.getRequestHandler()
const port = dev ? 3000 : 8000

Dotenv.config({ path: `${__dirname}/../.env` })

// init i18next with serverside settings
// using i18next-express-middleware
i18nInstance
  .use(Backend)
  .use(LanguageDetector)
  .init({
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

        server.listen(port, (err) => {
          if (err) { throw err }
        })
      })
      .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
      })
  })
