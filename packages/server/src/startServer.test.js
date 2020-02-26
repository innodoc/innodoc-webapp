import express from 'express'
import next from 'next'

import startServer from './startServer'

const mockExpressUse = jest.fn()
const mockExpressGet = jest.fn()
const mockExpressListen = jest.fn(() => Promise.resolve())
const mockExpress = {
  use: mockExpressUse,
  get: mockExpressGet,
  listen: mockExpressListen,
}
mockExpressUse.mockImplementation(() => mockExpress)
mockExpressGet.mockImplementation(() => mockExpress)
jest.mock('express', () => jest.fn(() => mockExpress))

const mockAppPrepare = jest.fn(() => Promise.resolve())
const mockAppGetRequestHandler = jest.fn()
jest.mock('next', () =>
  jest.fn(() => ({
    prepare: mockAppPrepare,
    getRequestHandler: mockAppGetRequestHandler,
  }))
)
jest.mock('next-i18next/middleware', () => jest.fn())

jest.mock('@innodoc/client-misc/src/i18n', () => {})

describe.each(['production', 'development'])('startServer (%s)', (nodeEnv) => {
  let mockLog
  beforeEach(() => {
    jest.clearAllMocks()
    startServer(
      '/mock/src',
      8123,
      'https://example.com/static/',
      'https://example.com/content/',
      nodeEnv
    )
    mockLog = jest.spyOn(console, 'info').mockImplementation(() => {})
  })
  afterEach(() => {
    mockLog.mockRestore()
  })

  it('should create next app', () => {
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith({
      dir: '/mock/src',
      dev: nodeEnv === 'development',
    })
    expect(mockAppPrepare).toHaveBeenCalledTimes(1)
  })

  it('should create express instance', () => {
    expect(express).toHaveBeenCalledTimes(1)
    expect(mockExpressUse).toHaveBeenCalled()
    expect(mockExpressGet).toHaveBeenCalled()
    expect(mockExpressListen).toHaveBeenCalledTimes(1)
    expect(mockAppGetRequestHandler).toHaveBeenCalledTimes(1)
  })

  it('should print log message', () => {
    expect(mockLog).toHaveBeenCalledTimes(1)
    expect(mockLog).toHaveBeenCalledWith(
      `Started ${nodeEnv} server on port 8123.`
    )
  })
})
