const path = require('path')
const NextI18Next = require('next-i18next').default

module.exports = new NextI18Next({
  defaultLanguage: 'en',
  load: 'languageOnly',
  localePath: process.browser
    ? 'locales'
    : path.join('..', 'client-web', 'src', 'public', 'locales'),
  otherLanguages: ['de'],
  saveMissing: !process.browser && process.env.NODE_ENV !== 'production',
})
