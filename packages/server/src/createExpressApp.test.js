import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import express from 'express'
import nextI18NextMiddleware from 'next-i18next/middleware'

import nextI18next from '@innodoc/client-misc/src/i18n'

import createExpressApp from './createExpressApp'
import {
  passConfigMiddleware,
  passportMiddleware,
  sendMailMiddleware,
  verifyAccessTokenMiddleware,
} from './middlewares'
import { nextController, userController } from './controllers'

const mockBodyParserJson = {}
jest.mock('body-parser', () => ({
  json: jest.fn(() => mockBodyParserJson),
}))

const mockCookieParser = {}
jest.mock('cookie-parser', () => jest.fn(() => mockCookieParser))

const mockCsrf = {}
jest.mock('csurf', () => jest.fn(() => mockCsrf))

const mockExpressApp = {
  use: jest.fn(() => mockExpressApp),
}
jest.mock('express', () => jest.fn(() => mockExpressApp))

const mockNextI18NextMiddleware = {}
jest.mock('next-i18next/middleware', () =>
  jest.fn(() => mockNextI18NextMiddleware)
)

jest.mock('@innodoc/client-misc/src/i18n', () => ({}))

const mockNextController = {}
const mockUserController = {}
jest.mock('./controllers', () => ({
  nextController: jest.fn(() => mockNextController),
  userController: jest.fn(() => mockUserController),
}))

const mockPassConfigMiddleware = {}
const mockPassportMiddleware = {}
const mockSendMailMiddleware = {}
const mockVerifyAccessTokenMiddleware = {}
jest.mock('./middlewares', () => ({
  passConfigMiddleware: jest.fn(() => mockPassConfigMiddleware),
  passportMiddleware: jest.fn(() => mockPassportMiddleware),
  sendMailMiddleware: jest.fn(() => mockSendMailMiddleware),
  verifyAccessTokenMiddleware: jest.fn(() => mockVerifyAccessTokenMiddleware),
}))

const config = {
  appRoot: 'http://app.example.com/',
  nodeEnv: 'production',
  smtp: {},
}

describe('createExpressApp', () => {
  const mockNextApp = {}
  let returnedExpressApp

  beforeEach(() => {
    jest.clearAllMocks()
    returnedExpressApp = createExpressApp(config, mockNextApp)
  })

  it('should instantiate and return express app', () => {
    expect(returnedExpressApp).toBe(mockExpressApp)
    expect(express).toBeCalled()
  })

  describe('middlewares', () => {
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

    it('should use nextI18NextMiddleware', () => {
      expect(nextI18NextMiddleware).toBeCalledWith(nextI18next)
      expect(mockExpressApp.use).toBeCalledWith(mockNextI18NextMiddleware)
    })

    describe('innodoc middleswares', () => {
      it('should use passConfigMiddleware', () => {
        expect(passConfigMiddleware).toBeCalledWith(config)
        expect(mockExpressApp.use).toBeCalledWith(mockPassConfigMiddleware)
      })

      it('should use sendMailMiddleware', () => {
        expect(sendMailMiddleware).toBeCalledWith(config.smtp)
        expect(mockExpressApp.use).toBeCalledWith(mockSendMailMiddleware)
      })

      it('should use verifyAccessTokenMiddleware', () => {
        expect(verifyAccessTokenMiddleware).toBeCalledWith(config)
        expect(mockExpressApp.use).toBeCalledWith(
          mockVerifyAccessTokenMiddleware
        )
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

    it('should use nextController', () => {
      expect(nextController).toBeCalledWith(config, mockNextApp)
      expect(mockExpressApp.use).toBeCalledWith(mockNextController)
    })
  })
})