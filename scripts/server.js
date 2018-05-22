import Dotenv from 'dotenv'

import path from 'path'
import express from 'express'
import next from 'next'

import i18nextMiddleware, { LanguageDetector } from 'i18next-express-middleware'
import Backend from 'i18next-node-fs-backend'

import { i18nInstance } from '../i18n'

Dotenv.config({ path: `${__dirname}/../.env` })

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = dev ? 3000 : 8000

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
      loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json'),
    },
  }, () => {
    // loaded translations we can bootstrap our routes
    app.prepare()
      .then(() => {
        const server = express()

        // enable middleware for i18next
        server.use(i18nextMiddleware.handle(i18nInstance))

        // serve locales for client
        server.use('/locales', express.static(path.join(__dirname, '../locales')))

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
