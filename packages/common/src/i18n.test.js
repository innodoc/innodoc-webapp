import path from 'path'
import fs from 'fs'

jest.mock('next-i18next', () => ({
  default: jest.fn().mockImplementation((config) => ({ config })),
}))

jest.mock('next/config', () => ({
  default: jest.fn().mockImplementation(() => ({
    publicRuntimeConfig: {
      defaultLanguage: 'en',
      otherLanguages: ['de'],
    },
  })),
}))

let NextI18Next
let i18n
let windowSpy

describe.each(['server', 'client'])('i18n (%s)', (environment) => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    if (environment === 'server') {
      windowSpy = jest.spyOn(global, 'window', 'get')
      windowSpy.mockImplementation(() => undefined)
    }
    /* eslint-disable global-require */
    NextI18Next = require('next-i18next').default
    i18n = require('./i18n')
    /* eslint-enable global-require */
  })

  afterEach(() => {
    if (environment === 'server') {
      windowSpy.mockRestore()
    }
  })

  it('should call NextI18Next constructor', () => {
    expect(NextI18Next).toHaveBeenCalledTimes(1)
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
