import next from 'next'

import createApp from '.'

const mockAppPrepare = jest.fn(() => Promise.resolve())
jest.mock('next', () => jest.fn(() => ({ prepare: mockAppPrepare })))

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
