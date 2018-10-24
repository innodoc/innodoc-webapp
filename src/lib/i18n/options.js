const i18nOptions = {
  fallbackLng: 'en',
  // we only provide en, de -> no region specific locals like en-US, de-DE
  load: 'languageOnly',
  // have a common namespace used around the full app
  ns: ['common'],
  defaultNS: 'common',
  debug: process.env.I18NEXT_DEBUG === 'true',
  saveMissing: true,
  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
    format: (value, format) => {
      if (format === 'uppercase') return value.toUpperCase()
      return value
    },
  },
  detection: {
    order: ['cookie', 'navigator'],
    caches: ['localStorage', 'cookie'],
  },
  backend: {
    loadPath: '/static/locales/{{lng}}/{{ns}}.json',
    addPath: '/static/locales/{{lng}}/{{ns}}.missing.json',
  },
}

module.exports = i18nOptions
