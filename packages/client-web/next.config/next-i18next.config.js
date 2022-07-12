const path = require('path')

let localePath = 'public/locales'

// On server we need the actual directory
if (typeof window === 'undefined') {
  localePath =
    __dirname.split(path.sep).at(-1) === 'next.config'
      ? // file compiled in 'NEXT_BUILD_DIR/server/pages'!
        path.resolve(__dirname, '..', 'src', 'public', 'locales')
      : // __dirname actual file location
        path.resolve(__dirname, '..', '..', '..', 'public', 'locales')
}

module.exports = {
  i18n: {
    defaultLocale: 'de',
    localePath,
    locales: ['de', 'en'],
    serializeConfig: false,
  },
}
