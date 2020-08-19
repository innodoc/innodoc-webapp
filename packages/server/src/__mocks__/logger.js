const mockLoggers = {}

const getLogger = jest.fn((name) => {
  if (!Object.hasOwnProperty.call(mockLoggers, name)) {
    mockLoggers[name] = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    }
  }
  return mockLoggers[name]
})

const configureLogger = jest.fn(() => ({ getLogger }))

const requestLoggerMiddleware = (req, res, next) => next()

export { configureLogger, requestLoggerMiddleware }
export default getLogger
