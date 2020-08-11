import path from 'path'
import fs from 'fs'

let i18n
let NextI18Next
const processBrowserOrig = process.browser

describe.each(['server', 'client'])('i18n (%s)', (environment) => {
  beforeEach(() => {
    jest.resetModules()
    process.browser = environment === 'client'
    /* eslint-disable global-require */
    i18n = require('./i18n')
    NextI18Next = require('next-i18next').default
    /* eslint-enable global-require */
  })

  afterEach(() => {
    process.browser = processBrowserOrig
  })

  it('should be an instance of NextI18Next', () => {
    expect(i18n).toBeInstanceOf(NextI18Next)
  })

  it('should have default language en', () => {
    expect(i18n.config.defaultLanguage).toBe('en')
  })

  it('should load current language only', () => {
    expect(i18n.config.load).toBe('languageOnly')
  })

  it('should have other languages set', () => {
    expect(i18n.config.otherLanguages).toEqual(['de'])
  })

  it('should have saveMissing set', () => {
    expect(i18n.config.saveMissing).toBe(environment === 'server')
  })

  it('should have correct locale path', () => {
    if (environment === 'server') {
      const localeFilepath = path.resolve(
        __dirname,
        '..',
        i18n.config.localePath,
        'en',
        'common.json'
      )
      expect(fs.existsSync(localeFilepath)).toBe(true)
    } else {
      expect(i18n.config.localePath).toBe('/locales')
    }
  })
})
