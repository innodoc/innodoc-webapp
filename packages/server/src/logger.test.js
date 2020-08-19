import log4js from 'log4js'

import getLogger, { configureLogger, requestLoggerMiddleware } from './logger'

const mockLogger = {}
const mockLogMiddleware = {}
jest.mock('log4js', () => ({
  configure: jest.fn(() => mockLogger),
  connectLogger: jest.fn(() => mockLogMiddleware),
  getLogger: jest.fn((name) => ({ name })),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('configureLogger', () => {
  it('should configure log file in production', () => {
    const logger = configureLogger({ logFile: '/var/log/foo.log', nodeEnv: 'production' })
    expect(logger).toBe(mockLogger)
    expect(log4js.configure).toBeCalledTimes(1)
    const opts = log4js.configure.mock.calls[0][0]
    expect(opts.appenders.logfile.type).toBe('file')
    expect(opts.appenders.logfile.filename).toBe('/var/log/foo.log')
    expect(opts.categories.default.appenders[0]).toBe('logfile')
    expect(opts.categories.default.level).toBe('info')
    expect(opts.categories.default.enableCallStack).toBe(true)
  })

  it('should configure console in development', () => {
    const logger = configureLogger({ logFile: '/var/log/foo.log', nodeEnv: 'development' })
    expect(logger).toBe(mockLogger)
    expect(log4js.configure).toBeCalledTimes(1)
    const opts = log4js.configure.mock.calls[0][0]
    expect(opts.appenders.console.type).toBe('stdout')
    expect(opts.categories.default.appenders[0]).toBe('console')
    expect(opts.categories.default.level).toBe('debug')
    expect(opts.categories.default.enableCallStack).toBe(true)
  })
})

describe('requestLoggerMiddleware', () => {
  it('should return connectLogger with request logger', () => {
    const middleware = requestLoggerMiddleware()
    expect(middleware).toBe(mockLogMiddleware)
    expect(log4js.getLogger).toBeCalledWith('request')
    expect(log4js.connectLogger).toBeCalledWith({ name: 'request' })
  })
})

describe('getLogger', () => {
  it('should call log4js.getLogger', () => {
    getLogger('foo')
    expect(log4js.getLogger).toBeCalledTimes(1)
    expect(log4js.getLogger).toBeCalledWith('foo')
  })
})
