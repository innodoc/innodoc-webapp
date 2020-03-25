import path from 'path'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import express from 'express'
import mongoose from 'mongoose'
import next from 'next'
import nextI18NextMiddleware from 'next-i18next/middleware'
import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'

import nextI18next from '@innodoc/client-misc/src/i18n'
import getConfig from './getConfig'
import { getContentPath } from './util'
import {
  verifyAccessTokenMiddleware,
  passConfigMiddleware,
  sendMailMiddleware,
} from './middlewares'
import { User, userRoutes } from './user'
import startServer from './startServer'

const mockConfig = {
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
}

const mockBodyParserJson = {}
jest.mock('body-parser', () => ({
  json: jest.fn(() => mockBodyParserJson),
}))

const mockCookieParser = {}
jest.mock('cookie-parser', () => jest.fn(() => mockCookieParser))

const mockCsrf = {}
jest.mock('csurf', () => jest.fn(() => mockCsrf))

const mockExpress = {
  get: jest.fn(() => mockExpress),
  listen: jest.fn(() => Promise.resolve()),
  use: jest.fn(() => mockExpress),
}
jest.mock('express', () => jest.fn(() => mockExpress))

const mockNextPrepare = jest.fn().mockResolvedValue()
const mockNextAppRequestHandler = () => {}
const mockNextApp = {
  getRequestHandler: jest.fn(() => mockNextAppRequestHandler),
  prepare: () => mockNextPrepare(),
  render: jest.fn(),
}
jest.mock('next', () => jest.fn(() => mockNextApp))

const mockNextI18NextMiddleware = {}
jest.mock('next-i18next/middleware', () =>
  jest.fn(() => mockNextI18NextMiddleware)
)

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  set: jest.fn(),
}))

const mockPassportMiddleware = {}
jest.mock('passport', () => ({
  deserializeUser: jest.fn(),
  initialize: jest.fn(() => mockPassportMiddleware),
  serializeUser: jest.fn(),
  use: jest.fn(),
}))

const mockJwtStrategy = {}
jest.mock('passport-jwt', () => ({
  Strategy: jest.fn(() => mockJwtStrategy),
}))

jest.mock('@innodoc/client-misc/src/i18n', () => ({}))

jest.mock('./getConfig', () => jest.fn(() => mockConfig))

const mockPageHandler = () => {}
const mockSectionHandler = () => {}
jest.mock('./util', () => ({
  getContentPath: jest.requireActual('./util').getContentPath,
  handleCustomRoute: jest.fn((_, url) =>
    url === '/section' ? mockSectionHandler : mockPageHandler
  ),
}))

const mockVerifyAccessToken = {}
const mockPassConfig = {}
const mockSendMail = {}
jest.mock('./middlewares', () => ({
  verifyAccessTokenMiddleware: jest.fn(() => mockVerifyAccessToken),
  passConfigMiddleware: jest.fn(() => mockPassConfig),
  sendMailMiddleware: jest.fn(() => mockSendMail),
}))

const mockDeserializeUser = {}
const mockSerializeUser = {}
const mockUserStrategy = {}
const mockUserRoutes = {}
jest.mock('./user', () => ({
  User: {
    createStrategy: jest.fn(() => mockUserStrategy),
    deserializeUser: jest.fn(() => mockDeserializeUser),
    serializeUser: jest.fn(() => mockSerializeUser),
  },
  userRoutes: jest.fn(() => mockUserRoutes),
  tokenRegexp: 'TOKENREGEXP',
}))

describe('startServer', () => {
  const rootDir = path.resolve('mock', 'root')
  let config

  beforeAll(async () => {
    config = await startServer(rootDir)
  })

  it('should return config', () => {
    expect(getConfig).toBeCalledWith(rootDir)
    expect(config).toBe(mockConfig)
  })

  it('should instantiate next.js', () => {
    expect(next).toBeCalledWith({
      dir: path.resolve(rootDir, 'packages', 'client-web', 'src'),
      dev: false,
    })
    expect(mockNextPrepare).toBeCalled()
  })

  it('should connect to mongodb', () => {
    expect(mongoose.connect).toBeCalledWith('mongodb://mongohost/coll', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    expect(mongoose.set).toBeCalledWith('debug', false)
  })

  describe('passport', () => {
    describe('JWT strategy', () => {
      let jwtConfig
      let jwtVerify

      beforeAll(() => {
        ;[[jwtConfig, jwtVerify]] = JwtStrategy.mock.calls
      })

      it('should create JWT strategy', () => {
        expect(JwtStrategy).toBeCalled()
      })

      it('should pass JWT strategy config', () => {
        expect(jwtConfig.issuer).toBe(config.appRoot)
        expect(jwtConfig.secretOrKey).toBe(config.jwtSecret)
      })

      it('should have jwtFromRequest function', () => {
        const { jwtFromRequest } = jwtConfig
        expect(jwtFromRequest()).toBeFalsy()
        expect(jwtFromRequest({})).toBeFalsy()
        expect(jwtFromRequest({ cookies: {} })).toBeFalsy()
        expect(jwtFromRequest({ cookies: { accessToken: '123token!' } })).toBe(
          '123token!'
        )
      })

      describe('verify function', () => {
        it('should return sub', () => {
          const ret = {}
          const done = jest.fn(() => ret)
          expect(jwtVerify({ sub: 'alice@example.com' }, done)).toBe(ret)
          expect(done).toBeCalledWith(null, 'alice@example.com')
        })

        it('should handle error', () => {
          const err = new Error('test error')
          const ret = {}
          const done = jest
            .fn()
            .mockImplementationOnce(() => {
              throw err
            })
            .mockImplementationOnce(() => ret)
          expect(jwtVerify({ sub: 'alice@example.com' }, done)).toBe(ret)
          expect(done).toBeCalledWith(null, 'alice@example.com')
          expect(done).toBeCalledWith(err)
        })
      })
    })

    it('should setup passport', () => {
      expect(passport.initialize).toBeCalled()
      expect(passport.use).toBeCalledWith(mockJwtStrategy)
      expect(passport.use).toBeCalledWith(mockUserStrategy)
      expect(passport.serializeUser).toBeCalledWith(mockSerializeUser)
      expect(passport.deserializeUser).toBeCalledWith(mockDeserializeUser)
      expect(User.createStrategy).toBeCalled()
      expect(User.serializeUser).toBeCalled()
      expect(User.deserializeUser).toBeCalled()
    })
  })

  describe('express', () => {
    it('should instantiate', () => {
      expect(express).toBeCalled()
    })

    it('should listen', () => {
      expect(mockExpress.listen).toBeCalledWith(8123)
    })

    describe('middlewares', () => {
      it('should use bodyParser.json', () => {
        expect(bodyParser.json).toBeCalled()
        expect(mockExpress.use).toBeCalledWith(mockBodyParserJson)
      })

      it('should use cookieParser', () => {
        expect(cookieParser).toBeCalled()
        expect(mockExpress.use).toBeCalledWith(mockCookieParser)
      })

      it('should use csrf', () => {
        expect(csrf).toBeCalledWith({
          cookie: { secure: true },
          value: expect.any(Function),
        })
        expect(mockExpress.use).toBeCalledWith(mockCsrf)
        const extractCsrfToken = csrf.mock.calls[0][0].value
        expect(
          extractCsrfToken({ headers: { 'csrf-token': '123csrfToken!' } })
        ).toBe('123csrfToken!')
        expect(extractCsrfToken({ headers: {} })).toBeUndefined()
      })

      it('should use passConfigMiddleware', () => {
        expect(passConfigMiddleware).toBeCalledWith(config)
        expect(mockExpress.use).toBeCalledWith(mockPassConfig)
      })

      it('should use sendMailMiddleware', () => {
        expect(sendMailMiddleware).toBeCalledWith(config.smtp)
        expect(mockExpress.use).toBeCalledWith(mockSendMail)
      })

      it('should use nextI18NextMiddleware', () => {
        expect(nextI18NextMiddleware).toBeCalledWith(nextI18next)
        expect(mockExpress.use).toBeCalledWith(mockNextI18NextMiddleware)
      })

      it('should use verifyAccessTokenMiddleware', () => {
        expect(verifyAccessTokenMiddleware).toBeCalledWith(config)
        expect(mockExpress.use).toBeCalledWith(mockVerifyAccessToken)
      })

      it('should use passportMiddleware', () => {
        const passportMiddleware = passport.initialize.mock.results[0].value
        expect(mockExpress.use).toBeCalledWith(passportMiddleware)
      })
    })

    describe('routes', () => {
      describe('custom next.js page routes', () => {
        const req = { params: {} }
        const res = {}

        beforeEach(() => {
          mockNextApp.render.mockClear()
        })

        it.each(['reset-password', 'verify-user'])(
          'should handle %s page',
          (pageName) => {
            const url = `/${pageName}/:token(TOKENREGEXP)`
            const call = mockExpress.get.mock.calls.find((c) => c[0] === url)
            call[1](req, res)
            expect(mockNextApp.render).toBeCalledWith(
              req,
              res,
              `/${pageName}`,
              req.params
            )
          }
        )

        it.each(['section', 'page'])('should handle %s page', (type) => {
          expect(mockExpress.get).toBeCalledWith(
            getContentPath(config[`${type}PathPrefix`]),
            type === 'section' ? mockSectionHandler : mockPageHandler
          )
        })
      })

      it('should use userRoutes', () => {
        expect(userRoutes).toBeCalledWith(config)
        expect(mockExpress.use).toBeCalledWith('/user', mockUserRoutes)
      })

      describe('wildcard route', () => {
        it('should be handled by next.js', () => {
          expect(mockNextApp.getRequestHandler).toBeCalled()
          expect(mockExpress.get).toBeCalledWith('*', mockNextAppRequestHandler)
        })

        it('should be last', () => {
          const { calls } = mockExpress.get.mock
          const call = calls.find((c) => c[0] === '*')
          expect(calls.indexOf(call)).toBe(calls.length - 1)
        })
      })
    })
  })
})
