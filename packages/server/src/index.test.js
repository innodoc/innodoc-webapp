describe('index', () => {
  let mockInfoLog
  let mockErrorLog
  let mockExit

  beforeEach(() => {
    jest.resetModules()
    mockInfoLog = jest.spyOn(console, 'info').mockImplementation(() => {})
    mockErrorLog = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
    jest.doMock('path', () => ({
      resolve: jest.fn().mockReturnValue('/mock/root'),
    }))
  })

  afterEach(() => {
    mockInfoLog.mockRestore()
    mockErrorLog.mockRestore()
    mockExit.mockRestore()
  })

  describe('proper startup', () => {
    beforeEach(async () => {
      jest.doMock('./startServer', () =>
        jest.fn().mockResolvedValue({ port: 7766, nodeEnv: 'production' })
      )
      await import('.')
    })

    it('should call startServer', async () => {
      expect.assertions(3)
      const startServer = await import('./startServer')
      expect(startServer).toHaveBeenCalledTimes(1)
      expect(startServer).toHaveBeenCalledWith('/mock/root')
      expect(mockExit).not.toHaveBeenCalled()
    })

    it('should print log message', () => {
      expect(mockInfoLog).toHaveBeenCalledTimes(1)
      expect(mockInfoLog.mock.calls[0][0].toString()).toMatch(
        'Started production server on port 7766'
      )
      expect(mockErrorLog).not.toHaveBeenCalled()
    })
  })

  describe('failed startup', () => {
    const error = new Error('MockError')

    beforeEach(async () => {
      jest.doMock('./startServer', () => jest.fn().mockRejectedValue(error))
      await import('.')
    })

    it('should catch and print errors', () => {
      expect(mockErrorLog).toHaveBeenCalledTimes(1)
      expect(mockErrorLog).toHaveBeenCalledWith(error)
      expect(mockInfoLog).not.toHaveBeenCalled()
    })

    it('should exit with code 1', () => {
      expect(mockExit).toHaveBeenCalledTimes(1)
      expect(mockExit).toHaveBeenCalledWith(1)
    })
  })
})
