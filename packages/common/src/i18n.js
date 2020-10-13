const path = require('path')
const getConfig = require('next/config').default
const NextI18Next = require('next-i18next').default

const nextI18NextConfig = {
  defaultLanguage: 'en',
  load: 'languageOnly',
  localePath:
    typeof window !== 'undefined'
      ? '/locales'
      : path.join('..', 'client-web', 'src', 'public', 'locales'),
  otherLanguages: [],
  saveMissing: typeof window === 'undefined' && process.env.NODE_ENV !== 'production',
}

const { publicRuntimeConfig: prc } = getConfig()
if (prc.defaultLanguage && prc.otherLanguages) {
  nextI18NextConfig.defaultLanguage = prc.defaultLanguage
  nextI18NextConfig.otherLanguages = prc.otherLanguages
}

module.exports = new NextI18Next(nextI18NextConfig)
