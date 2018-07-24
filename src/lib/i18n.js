const i18next = require('i18next')
const XHR = require('i18next-xhr-backend')
const LanguageDetector = require('i18next-browser-languagedetector')

const dev = process.env.NODE_ENV !== 'production'

const options = {
  fallbackLng: 'en',
  load: 'languageOnly', // we only provide en, de -> no region specific locals like en-US, de-DE

  // have a common namespace used around the full app
  ns: ['common'],
  defaultNS: 'common',

  debug: false,
  saveMissing: dev,

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
    format: (value, format) => {
      if (format === 'uppercase') return value.toUpperCase()
      return value
    },
  },
}

const i18nInstance = i18next

// for browser use xhr backend to load translations and browser lng detector
if (process.browser) {
  i18nInstance
    .use(XHR)
    // .use(Cache)
    .use(LanguageDetector)
}

// initialize if not already initialized
if (!i18nInstance.isInitialized) i18nInstance.init(options)

// a simple helper to getInitialProps passed on loaded i18n data
const getInitialProps = (req, namespaces = i18nInstance.options.defaultNS) => {
  const namespacesArr = Array.isArray(namespaces) ? namespaces : [namespaces]

  // do not serialize i18next instance and send to client
  req.i18n.toJSON = () => null

  const initialI18nStore = {}
  req.i18n.languages.forEach((l) => {
    initialI18nStore[l] = {}
    namespacesArr.forEach((ns) => {
      initialI18nStore[l][ns] = (req.i18n.services.resourceStore.data[l] || {})[ns] || {}
    })
  })

  return {
    // use the instance on req - fixed language on request (avoid issues in
    // race conditions with lngs of different users)
    i18n: req.i18n,
    initialI18nStore,
    initialLanguage: req.i18n.language,
  }
}

// Normalize language code to 2 letters (e.g. 'en-US' -> 'en').
const toTwoLetterCode = lang => (lang.length > 2 ? lang.substring(0, 2) : lang)

module.exports = {
  getInitialProps,
  i18nInstance,
  I18n: i18next.default,
  toTwoLetterCode,
}
