const NextI18Next = require('next-i18next').default

module.exports = new NextI18Next({
  defaultLanguage: 'en',
  load: 'languageOnly',
  localePath: process.browser ? 'static/locales' : 'src/static/locales',
  otherLanguages: ['de'],
  saveMissing: !process.browser && process.env.NODE_ENV !== 'production',
})
