import { createHttpTerminator } from 'http-terminator'

import startServer, { shutdown } from './index'
import createExpressApp from './createExpressApp'
import createNextApp from './createNextApp'
import { connectDb, disconnectDb } from './db'
import getConfig from './getConfig'
import getLogger, { configureLogger } from './logger'

const mockHttpTerminator = { terminate: jest.fn() }
jest.mock('http-terminator', () => ({
  createHttpTerminator: jest.fn(() => mockHttpTerminator),
}))

const mockServer = {}
const mockConfig = {
  host: 'localhost',
  port: 7654,
  logFile: '/var/log/foo.log',
  nodeEnv: 'production',
}
const mockExpressApp = { listen: jest.fn().mockResolvedValue(mockServer) }
const mockNextApp = {}

jest.mock('./logger')
jest.mock('./createExpressApp', () => jest.fn(() => mockExpressApp))
jest.mock('./createNextApp', () => jest.fn(() => Promise.resolve(mockNextApp)))
jest.mock('./db', () => ({
  connectDb: jest.fn(),
  disconnectDb: jest.fn(),
}))
jest.mock('./getConfig', () => jest.fn(() => mockConfig))

const mocks = { createExpressApp, createNextApp, connectDb, getConfig }

describe('startServer', () => {
  let mockExit

  beforeEach(() => {
    jest.clearAllMocks()
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
  })

  afterEach(() => {
    mockExit.mockRestore()
  })

  describe('successful startup', () => {
    beforeEach(startServer)

    it('should get config', () => {
      expect(mocks.getConfig).toHaveBeenCalledTimes(1)
    })

    it('should create next app', () => {
      expect(mocks.createNextApp).toHaveBeenCalledTimes(1)
      expect(mocks.createNextApp).toHaveBeenCalledWith(mockConfig)
    })

    it('should connect to MongoDB', () => {
      expect(mocks.connectDb).toHaveBeenCalledTimes(1)
      expect(mocks.connectDb).toHaveBeenCalledWith(mockConfig)
    })

    it('should not call process.exit', () => expect(mockExit).not.toHaveBeenCalled())

    it('should instantiate httpTerminator', () =>
      expect(createHttpTerminator.mock.calls[0][0].server).toBe(mockServer))

    describe('express app', () => {
      it('should create express app', () => {
        expect(mocks.createExpressApp).toHaveBeenCalledTimes(1)
        expect(mocks.createExpressApp).toHaveBeenCalledWith(mockConfig, mockNextApp)
      })

      it('should start listening to port', () => {
        expect(mockExpressApp.listen).toHaveBeenCalledTimes(1)
        expect(mockExpressApp.listen).toHaveBeenCalledWith(mockConfig.port, mockConfig.host)
      })
    })

    describe('logging', () => {
      it('should configure logging', () => {
        expect(configureLogger).toHaveBeenCalledTimes(1)
        expect(configureLogger.mock.calls[0][0].nodeEnv).toBe('production')
        expect(configureLogger.mock.calls[0][0].logFile).toBe('/var/log/foo.log')
      })

      it('should get logger', () => {
        expect(getLogger).toHaveBeenCalledTimes(1)
        expect(getLogger.mock.calls[0][0]).toBe('appserver')
      })

      it('should log info message', () => {
        const logger = getLogger('appserver')
        expect(logger.info).toHaveBeenCalledTimes(1)
        expect(logger.info.mock.calls[0][0].toString()).toMatch(
          'Started production server on localhost:7654'
        )
      })

      it('should not print error messages', () =>
        expect(getLogger('appserver').error).not.toHaveBeenCalled())
    })
  })

  describe('shutdown', () => {
    beforeEach(shutdown)

    it('should call disconnectDb()', () => expect(disconnectDb).toHaveBeenCalled())

    it('should call httpTerminator.terminate()', () =>
      expect(mockHttpTerminator.terminate).toHaveBeenCalled())

    it('should log shutdown', () =>
      expect(getLogger('appserver').info).toHaveBeenCalledWith('App server shut down.'))
  })

  describe('failed startup', () => {
    describe.each(['createExpressApp', 'createNextApp', 'connectDb', 'getConfig'])(
      '%s',
      (mockName) => {
        beforeEach(async () => {
          mocks[mockName].mockImplementationOnce(() => {
            throw new Error(mockName)
          })
          await startServer()
        })

        it('should process.exit with return code', () => {
          expect(mockExit).toHaveBeenCalledTimes(1)
          expect(mockExit).toHaveBeenCalledWith(1)
        })

        it('should log error', () => {
          const logger = getLogger('appserver')
          expect(logger.error).toHaveBeenCalledTimes(1)
          expect(logger.error.mock.calls[0][0].toString()).toMatch(mockName)
          expect(logger.info).not.toHaveBeenCalled()
        })
      }
    )
  })
})
