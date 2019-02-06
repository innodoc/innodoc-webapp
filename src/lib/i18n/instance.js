const i18next = require('i18next')
const XHR = require('i18next-xhr-backend')
const LanguageDetector = require('i18next-browser-languagedetector')
const i18nOptions = require('./options')

const i18n = i18next.default ? i18next.default : i18next

// for browser use XHR backend and browser language detector
if (process.browser) {
  i18n
    .use(XHR)
    // .use(Cache)
    .use(LanguageDetector)
}

if (!i18n.isInitialized) {
  i18n.init(i18nOptions)
}

// a simple helper to getInitialProps passed on loaded i18n data
i18n.getInitialProps = (req, namespaces = i18n.options.defaultNS) => {
  const namespacesArr = typeof namespaces === 'string' ? [namespaces] : namespaces

  // do not serialize i18next instance avoid sending it to client
  if (req && req.i18n) req.i18n.toJSON = () => null

  const ret = {
    // use the instance on req - fixed language on request
    // (avoid issues in race conditions with lngs of different users)
    i18n: req ? req.i18n : i18n,
  }

  // for serverside pass down initial translations
  if (req && req.i18n) {
    const initialI18nStore = {}
    req.i18n.languages.forEach((l) => {
      initialI18nStore[l] = {}
      namespacesArr.forEach((ns) => {
        initialI18nStore[l][ns] = (req.i18n.services.resourceStore.data[l] || {})[ns] || {}
      })
    })

    ret.initialI18nStore = initialI18nStore
    ret.initialLanguage = req.i18n.language
  }

  return ret
}

module.exports = i18n
