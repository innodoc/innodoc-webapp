import next from 'next'
import nextI18NextMiddleware from 'next-i18next/middleware'

import nextI18next from '@innodoc/client-misc/src/i18n'

import createApp, { setupExpress } from '.'
import { getContentPath, makeHandleCustomRoute } from './util'
import makePassConfigMiddleware from './makePassConfigMiddleware'

const mockAppPrepare = jest.fn(() => Promise.resolve())
jest.mock('next', () => jest.fn(() => ({ prepare: mockAppPrepare })))

const mockNextI18NextMiddleware = jest.fn()
jest.mock('next-i18next/middleware', () =>
  jest.fn(() => mockNextI18NextMiddleware)
)

jest.mock('@innodoc/client-misc/src/i18n', () => ({ MOCK_I18N: 'MOCK_I18N' }))

const mockMakePassConfigMiddleware = jest.fn()
jest.mock('./makePassConfigMiddleware', () =>
  jest.fn(() => mockMakePassConfigMiddleware)
)

jest.mock('./util', () => ({
  getContentPath: jest.fn(),
  makeHandleCustomRoute: jest.fn(),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('createApp', () => {
  test.each(['production', 'development'])('%s', async (nodeEnv) => {
    const nextApp = await createApp('/mock/src', nodeEnv)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith({
      dir: '/mock/src',
      dev: nodeEnv === 'development',
    })
    expect(nextApp).toBe(next.mock.results[0].value)
    expect(mockAppPrepare).toHaveBeenCalledTimes(1)
  })
})

describe('setupExpress', () => {
  const expressApp = {
    use: jest.fn(() => expressApp),
    get: jest.fn(() => expressApp),
  }
  const handler = () => {}
  const nextApp = {
    getRequestHandler: jest.fn(() => handler),
  }
  const config = { foo: 'foo' }

  describe('middleswares', () => {
    beforeEach(() => {
      setupExpress(expressApp, nextApp, config)
    })

    it('should use nextI18NextMiddleware', () => {
      expect(nextI18NextMiddleware).toHaveBeenCalledTimes(1)
      expect(nextI18NextMiddleware).toHaveBeenCalledWith(nextI18next)
      expect(expressApp.use).toHaveBeenCalledWith(mockNextI18NextMiddleware)
    })

    it('should use passConfigMiddleware', () => {
      expect(makePassConfigMiddleware).toHaveBeenCalledTimes(1)
      expect(makePassConfigMiddleware).toHaveBeenCalledWith(config)
      expect(expressApp.use).toHaveBeenCalledWith(mockMakePassConfigMiddleware)
    })
  })

  describe('routes', () => {
    it.each(['section', 'page'])('should handle %s URLs', (type) => {
      const contentPath = `/${type}/[a-z]`
      getContentPath.mockReturnValueOnce(contentPath)
      const handle = () => {}
      makeHandleCustomRoute.mockReturnValueOnce(handle)
      setupExpress(expressApp, nextApp, config)
      expect(makeHandleCustomRoute).toBeCalledWith(nextApp, `/${type}`)
      expect(expressApp.get).toBeCalledWith(contentPath, handle)
    })

    it('should pass everything else to next request handler', () => {
      setupExpress(expressApp, nextApp, config)
      expect(nextApp.getRequestHandler).toHaveBeenCalledTimes(1)
      expect(expressApp.get).toBeCalledWith('*', handler)
    })
  })
})
