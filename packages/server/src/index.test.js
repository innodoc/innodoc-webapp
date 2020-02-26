const mockConfig = {
  contentRoot: 'https://example.com/content',
  staticRoot: 'https://example.com/static',
  nodeEnv: 'development',
  port: 8123,
}

describe('index', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('path', () => ({
      resolve: jest
        .fn()
        .mockReturnValueOnce('/mock/root')
        .mockReturnValueOnce('/mock/src'),
    }))
  })

  describe('regular startup', () => {
    let getConfig
    let startServer

    beforeEach(async () => {
      jest.doMock('./getConfig', () => jest.fn(() => mockConfig))
      jest.doMock('./startServer', () => jest.fn())
      getConfig = await import('./getConfig')
      startServer = await import('./startServer')
    })

    it('should get config', () =>
      import('.').then(() => {
        expect(getConfig).toBeCalledTimes(1)
        expect(getConfig).toBeCalledWith('/mock/root')
      }))

    it('should start server', () =>
      import('.').then(() => {
        expect(startServer).toBeCalledTimes(1)
        expect(startServer).toBeCalledWith(
          '/mock/src',
          8123,
          'https://example.com/static',
          'https://example.com/content',
          'development'
        )
      }))
  })

  describe('errors', () => {
    let mockExit
    let mockLog
    beforeEach(() => {
      mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
      mockLog = jest.spyOn(console, 'error').mockImplementation(() => {})
    })
    afterEach(() => {
      mockExit.mockRestore()
      mockLog.mockRestore()
    })

    it.each(['getConfig', 'startServer'])(
      'should exit process and log on error in %s',
      (module) => {
        jest.doMock(`./${module}`, () =>
          jest.fn(() => {
            throw new Error('MockError')
          })
        )
        if (module === 'getConfig') {
          jest.doMock('./startServer', () => () => {})
        } else {
          jest.doMock('./getConfig', () => () => mockConfig)
        }
        return import('.').then(() => {
          expect(mockLog).toHaveBeenCalledTimes(1)
          expect(mockLog.mock.calls[0][0].toString()).toMatch('MockError')
          expect(mockExit).toHaveBeenCalledTimes(1)
          expect(mockExit).toHaveBeenCalledWith(1)
        })
      }
    )
  })
})
