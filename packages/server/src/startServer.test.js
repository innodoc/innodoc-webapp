import express from 'express'

import getConfig from './getConfig'
import createNextApp, { setupExpress } from './nextApp'
import startServer from './startServer'

const mockConfig = {
  contentRoot: 'https://example.com/content',
  staticRoot: 'https://example.com/static',
  nodeEnv: 'development',
  port: 8123,
  sectionPathPrefix: 'section',
  pagePathPrefix: 'page',
}

jest.mock('express', () =>
  jest.fn(() => ({
    listen: jest.fn(),
  }))
)

jest.mock('./getConfig', () => jest.fn(() => mockConfig))

jest.mock('./nextApp', () => ({
  __esModule: true,
  default: jest.fn(),
  setupExpress: jest.fn(),
}))

describe('startServer', () => {
  it('should start', async () => {
    const ret = await startServer('/mock/root')
    expect(ret).toBe(mockConfig)
    expect(getConfig).toBeCalledTimes(1)
    expect(getConfig).toBeCalledWith('/mock/root')
    const config = getConfig.mock.results[0].value
    expect(createNextApp).toBeCalledTimes(1)
    expect(createNextApp).toBeCalledWith(
      '/mock/root/packages/client-web/src',
      'development'
    )
    const nextApp = createNextApp.mock.results[0].value
    expect(express).toBeCalledTimes(1)
    const expressApp = express.mock.results[0].value
    expect(setupExpress).toBeCalledTimes(1)
    expect(setupExpress).toBeCalledWith(expressApp, nextApp, config)
    expect(expressApp.listen).toBeCalledTimes(1)
    expect(expressApp.listen).toBeCalledWith(8123)
  })
})
