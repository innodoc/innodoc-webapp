import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import express from 'express'

import createExpressApp from './createExpressApp'
import { requestLoggerMiddleware } from './logger'
import { passportMiddleware, sendMailMiddleware, lookupUserMiddleware } from './middlewares'
import userController from './userController'

const mockBodyParserJson = {}
jest.mock('body-parser', () => ({
  json: jest.fn(() => mockBodyParserJson),
}))

const mockCookieParser = {}
jest.mock('cookie-parser', () => jest.fn(() => mockCookieParser))

const mockCsrf = {}
jest.mock('csurf', () => jest.fn(() => mockCsrf))

const mockExpressApp = {
  get: jest.fn(() => mockExpressApp),
  use: jest.fn(() => mockExpressApp),
}
jest.mock('express', () => jest.fn(() => mockExpressApp))

jest.mock('./logger')

const mockUserController = {}
jest.mock('./userController', () => jest.fn(() => mockUserController))

const mockPassportMiddleware = {}
const mockSendMailMiddleware = {}
const mockLookupUserMiddleware = {}
jest.mock('./middlewares', () => ({
  passportMiddleware: jest.fn(() => mockPassportMiddleware),
  sendMailMiddleware: jest.fn(() => mockSendMailMiddleware),
  lookupUserMiddleware: jest.fn(() => mockLookupUserMiddleware),
}))

const defaultConfig = {
  appRoot: 'http://app.example.com/',
  nodeEnv: 'production',
  smtp: {},
}
let config

describe.each(['production', 'development'])('createExpressApp (%s)', (nodeEnv) => {
  const mockNextRequestHandler = () => {}
  const mockNextApp = { getRequestHandler: () => mockNextRequestHandler }
  let returnedExpressApp

  beforeEach(() => {
    jest.clearAllMocks()
    config = { ...defaultConfig, nodeEnv }
    returnedExpressApp = createExpressApp(config, mockNextApp)
  })

  it('should instantiate and return express app', () => {
    expect(returnedExpressApp).toBe(mockExpressApp)
    expect(express).toBeCalled()
  })

  describe('middlewares', () => {
    it(`should ${nodeEnv === 'production' ? 'not ' : ''}use request logger`, () => {
      if (nodeEnv === 'production') {
        expect(requestLoggerMiddleware).not.toBeCalled()
      } else {
        expect(requestLoggerMiddleware).toBeCalled()
      }
      expect(mockExpressApp.use).toBeCalledWith(mockBodyParserJson)
    })

    it('should use bodyParser.json', () => {
      expect(bodyParser.json).toBeCalled()
      expect(mockExpressApp.use).toBeCalledWith(mockBodyParserJson)
    })

    it('should use cookieParser', () => {
      expect(cookieParser).toBeCalled()
      expect(mockExpressApp.use).toBeCalledWith(mockCookieParser)
    })

    describe('csrf', () => {
      it('should use csrf', () => {
        expect(csrf).toBeCalledWith({
          cookie: { secure: false },
          value: expect.any(Function),
        })
        expect(mockExpressApp.use).toBeCalledWith(mockCsrf)
      })

      it.each([
        ['123csrfToken!', { 'csrf-token': '123csrfToken!' }],
        [undefined, {}],
      ])('should extract csrf token (%s)', (token, headers) => {
        const extractCsrfToken = csrf.mock.calls[0][0].value
        expect(extractCsrfToken({ headers })).toBe(token)
      })
    })

    describe('innodoc middleswares', () => {
      it('should use sendMailMiddleware', () => {
        expect(sendMailMiddleware).toBeCalledWith(config.smtp)
        expect(mockExpressApp.use).toBeCalledWith(mockSendMailMiddleware)
      })

      it('should use lookupUserMiddleware', () => {
        expect(lookupUserMiddleware).toBeCalledWith(config)
        expect(mockExpressApp.use).toBeCalledWith(mockLookupUserMiddleware)
      })

      it('should use passportMiddleware', () => {
        expect(passportMiddleware).toBeCalledWith(config)
        expect(mockExpressApp.use).toBeCalledWith(mockPassportMiddleware)
      })
    })
  })

  describe('controllers', () => {
    it('should use userController', () => {
      expect(userController).toBeCalledWith(config)
      expect(mockExpressApp.use).toBeCalledWith(mockUserController)
    })

    it('should use next.getRequestHandler', () => {
      expect(mockExpressApp.get).toBeCalledWith('*', mockNextRequestHandler)
    })
  })
})
