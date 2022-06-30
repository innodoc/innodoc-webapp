const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    localePath:
      typeof window === 'undefined'
        ? path.resolve(__dirname, '..', '..', '..', '..', 'public', 'locales')
        : '/locales',
  },
}
