import { createHttpTerminator } from 'http-terminator'

import startServer, { shutdown } from './index'
import createExpressApp from './createExpressApp'
import createNextApp from './createNextApp'
import { connectDb, disconnectDb } from './db'
import getConfig from './getConfig'

const mockHttpTerminator = { terminate: jest.fn() }
jest.mock('http-terminator', () => ({
  createHttpTerminator: jest.fn(() => mockHttpTerminator),
}))

const mockServer = {}
const mockConfig = {
  host: 'localhost',
  port: 7654,
  nodeEnv: 'production',
}
const mockExpressApp = { listen: jest.fn().mockResolvedValue(mockServer) }
const mockNextApp = {}

jest.mock('./createExpressApp', () => jest.fn(() => mockExpressApp))
jest.mock('./createNextApp', () => jest.fn(() => Promise.resolve(mockNextApp)))
jest.mock('./db', () => ({
  connectDb: jest.fn(),
  disconnectDb: jest.fn(),
}))
jest.mock('./getConfig', () => jest.fn(() => mockConfig))

const mocks = { createExpressApp, createNextApp, connectDb, getConfig }

describe('startServer', () => {
  let mockInfoLog
  let mockErrorLog
  let mockExit

  beforeEach(() => {
    jest.clearAllMocks()

    mockInfoLog = jest.spyOn(console, 'info').mockImplementation(() => {})
    mockErrorLog = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
  })

  afterEach(() => {
    mockInfoLog.mockRestore()
    mockErrorLog.mockRestore()
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
      it('should log info message', () => {
        expect(mockInfoLog).toHaveBeenCalledTimes(1)
        expect(mockInfoLog.mock.calls[0][0].toString()).toMatch(
          'Started production server on localhost:7654'
        )
      })

      it('should not print error messages', () => expect(mockErrorLog).not.toHaveBeenCalled())
    })
  })

  describe('shutdown', () => {
    beforeEach(shutdown)

    it('should call disconnectDb()', () => expect(disconnectDb).toHaveBeenCalled())

    it('should call httpTerminator.terminate()', () =>
      expect(mockHttpTerminator.terminate).toHaveBeenCalled())
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
          expect(mockErrorLog).toHaveBeenCalledTimes(1)
          expect(mockErrorLog.mock.calls[0][0].toString()).toMatch(mockName)
          expect(mockInfoLog).not.toHaveBeenCalled()
        })
      }
    )
  })
})
