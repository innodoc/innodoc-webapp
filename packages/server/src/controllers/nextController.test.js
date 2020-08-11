import request from 'supertest'
import createExpressApp from '../createExpressApp'
import User, { tokenRegexp } from '../models/User'
import { getContentPath, handleCustomRoute } from './util'

jest.mock('mongoose', () => ({
  Schema: class Schema {
    constructor() {
      this.methods = {}
      this.statics = {}
    }

    plugin() {} // eslint-disable-line class-methods-use-this
  },
  model: (name, schema) => ({
    generateToken: schema.statics.generateToken,
  }),
}))

jest.mock('@innodoc/client-misc/src/i18n', () => ({
  i18n: { t: (s) => s },
}))

jest.mock('i18next-http-middleware', () => ({
  handle: (i18n) => (req, res, next) => {
    req.t = i18n.t
    next()
  },
}))

const mockStatus200 = (req, res) => res.status(200).end()

const mockHandlers = {
  page: jest.fn(mockStatus200),
  section: jest.fn(mockStatus200),
}
jest.mock('./util', () => ({
  getContentPath: jest.requireActual('./util').getContentPath,
  handleCustomRoute: jest.fn((nextApp, type) => mockHandlers[type.substr(1)]),
}))

const mockNoopMiddleware = (req, res, next) => next()
jest.mock('../middlewares', () => ({
  i18nMiddleware: () => mockNoopMiddleware,
  verifyAccessTokenMiddleware: () => mockNoopMiddleware,
  passConfigMiddleware: () => mockNoopMiddleware,
  passportMiddleware: () => mockNoopMiddleware,
  sendMailMiddleware: () => mockNoopMiddleware,
}))

const config = {
  appRoot: 'http://app.example.com/',
  pagePathPrefix: 'page',
  sectionPathPrefix: 'section',
}

const mockRequestHandler = jest.fn(mockStatus200)
const mockNextApp = {
  render: jest.fn(mockStatus200),
  getRequestHandler: jest.fn(() => mockRequestHandler),
}

describe('nextController', () => {
  beforeEach(jest.clearAllMocks)

  const testGet = async (url) => request(await createExpressApp(config, mockNextApp)).get(url)

  describe('Instantiation', () => {
    beforeEach(() => createExpressApp(config, mockNextApp))

    it('should call handleCustomRoute', () => {
      expect(handleCustomRoute).toBeCalledTimes(2)
      expect(handleCustomRoute).toBeCalledWith(mockNextApp, '/page')
      expect(handleCustomRoute).toBeCalledWith(mockNextApp, '/section')
    })

    it('should call next.getRequestHandler()', () => {
      expect(mockNextApp.getRequestHandler).toBeCalledWith()
    })
  })

  describe.each(['reset-password', 'verify-user'])(`GET /%s/:token(${tokenRegexp})`, (pageName) => {
    it('should use next.render()', () => {
      const token = User.generateToken()
      return testGet(`/${pageName}/${token}`).then(() => {
        expect(mockNextApp.render).toBeCalledWith(
          expect.any(Object),
          expect.any(Object),
          `/${pageName}`,
          { token }
        )
      })
    })
  })

  describe.each([
    [getContentPath(config.sectionPathPrefix), 'section'],
    [getContentPath(config.pagePathPrefix), 'page'],
  ])('GET %s', (contentPath, type) => {
    it('should use handleCustomRoute()', () =>
      testGet(`/${type}/foo`).then(() => {
        const req = mockHandlers[type].mock.calls[0][0]
        expect(req.params).toMatchObject({ contentId: 'foo' })
      }))
  })

  describe('GET *', () => {
    it('it should use next.getRequestHandler()', () =>
      testGet('/some-other-route').then(() => {
        expect(mockRequestHandler).toBeCalled()
      }))
  })
})
