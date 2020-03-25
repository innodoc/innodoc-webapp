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
    process.env.APP_ROOT = 'http://localhost:8123/'
    process.env.CONTENT_ROOT = 'https://example.com/content/'
    process.env.JWT_SECRET = 'jwtsecret123!'
    process.env.MONGODB_CONNECTION_STRING = 'mongodb://mongohost/coll'
    process.env.NODE_ENV = 'production'
    process.env.PAGE_PATH_PREFIX = 'custompage'
    process.env.SECTION_PATH_PREFIX = 'customsection'
    process.env.SMTP_HOST = 'mail.example.com'
    process.env.SMTP_PASSWORD = 's3cr3t'
    process.env.SMTP_PORT = '587'
    process.env.SMTP_SENDER = 'no-reply@example.com'
    process.env.SMTP_USER = 'alice'
    process.env.STATIC_ROOT = 'https://example.com/static/'
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
      appRoot: 'http://localhost:8123/',
      contentRoot: 'https://example.com/content/',
      jwtSecret: 'jwtsecret123!',
      mongodbConnectionString: 'mongodb://mongohost/coll',
      nodeEnv: 'production',
      pagePathPrefix: 'custompage',
      port: 8123,
      sectionPathPrefix: 'customsection',
      smtp: {
        host: 'mail.example.com',
        password: 's3cr3t',
        port: 587,
        user: 'alice',
        senderAddress: 'no-reply@example.com',
      },
      staticRoot: 'https://example.com/static/',
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
  })
})
