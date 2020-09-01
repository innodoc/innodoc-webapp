const path = require('path')
const NextI18Next = require('next-i18next').default

module.exports = new NextI18Next({
  defaultLanguage: 'en',
  load: 'languageOnly',
  localePath:
    typeof window !== 'undefined'
      ? '/locales'
      : path.join('..', 'client-web', 'src', 'public', 'locales'),
  otherLanguages: ['de'],
  saveMissing: typeof window === 'undefined' && process.env.NODE_ENV !== 'production',
})
