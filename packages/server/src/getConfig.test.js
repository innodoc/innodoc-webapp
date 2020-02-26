import fs from 'fs'
import Dotenv from 'dotenv-safe'

import getConfig from './getConfig'

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}))

jest.mock('dotenv-safe', () => ({
  config: jest.fn(),
}))

describe('getConfig', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    fs.existsSync.mockReset().mockReturnValue(true)
    Dotenv.config.mockClear()
    process.env.NODE_ENV = 'production'
    process.env.CONTENT_ROOT = 'https://example.com/content/'
    process.env.STATIC_ROOT = 'https://example.com/static/'
    process.env.PROD_PORT = '8123'
    process.env.SECTION_PATH_PREFIX = 'customsection'
    process.env.PAGE_PATH_PREFIX = 'custompage'
  })
  afterEach(() => {
    process.env = OLD_ENV
  })

  it('should use Dotenv', () => {
    getConfig('/mock/root')
    expect(Dotenv.config).toBeCalledTimes(1)
    expect(Dotenv.config).toBeCalledWith({
      example: '/mock/root/.env.example',
      path: '/mock/root/.env',
    })
  })

  it('should return config', () => {
    expect(getConfig('/mock/root')).toEqual({
      contentRoot: 'https://example.com/content/',
      staticRoot: 'https://example.com/static/',
      nodeEnv: 'production',
      port: 8123,
      sectionPathPrefix: 'customsection',
      pagePathPrefix: 'custompage',
    })
  })

  describe('roots', () => {
    it.each([
      ['CONTENT_ROOT', 'contentRoot'],
      ['STATIC_ROOT', 'staticRoot'],
    ])('should add trailing slash (%s)', (envVarName, propName) => {
      process.env[envVarName] = 'https://cdn.example.com/foo'
      const config = getConfig('/mock/root')
      expect(config[propName]).toBe('https://cdn.example.com/foo/')
    })

    it('should derive staticRoot from contentRoot', () => {
      delete process.env.STATIC_ROOT
      const config = getConfig('/mock/root')
      expect(config.staticRoot).toBe('https://example.com/content/_static/')
    })
  })

  describe('errors', () => {
    it("should throw if .env wasn't found", () => {
      fs.existsSync.mockReturnValue(false)
      expect(() => {
        getConfig('/mock/root')
      }).toThrow('Could not find configuration file')
      expect(fs.existsSync).toBeCalledTimes(1)
      expect(fs.existsSync).toBeCalledWith('/mock/root/.env')
    })

    it.each([
      ['production', 'PROD_PORT'],
      ['development', 'DEV_PORT'],
    ])("should throw if port isn't set (%s)", (nodeEnv, portVarName) => {
      process.env.NODE_ENV = nodeEnv
      delete process.env[portVarName]
      expect(() => {
        getConfig('/mock/root')
      }).toThrow(`You need to configure ${portVarName}`)
    })

    it("should throw if port can't be parsed", () => {
      process.env.PROD_PORT = 'abcd'
      expect(() => {
        getConfig('/mock/root')
      }).toThrow('Could not parse PROD_PORT')
    })
  })
})
