const path = require('path')
const NextI18Next = require('next-i18next').default
// const getConfig = require('next/config').default


// const { publicRuntimeConfig } = getConfig()

module.exports = new NextI18Next({
  defaultLanguage: 'en',
  load: 'languageOnly',
  localeSubpaths: {
    de: 'de',
    en: 'en',
  },
  localePath:
    typeof window !== 'undefined'
      ? '/locales'
      : path.join('..', 'client-web', 'src', 'public', 'locales'),
  otherLanguages: ['de'],
  saveMissing: typeof window === 'undefined' && process.env.NODE_ENV !== 'production',
})
