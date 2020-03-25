import next from 'next'

import createNextApp from './createNextApp'

jest.mock('next', () =>
  jest.fn(() => ({
    prepare: jest.fn().mockResolvedValue(),
  }))
)

describe('createNextApp', () => {
  it.each(['production', 'development'])(
    'should instantiate next.js (%s)',
    async (nodeEnv) => {
      const nextApp = await createNextApp({ nodeEnv })
      expect(next).toBeCalledWith({
        dir: expect.stringMatching(/packages\/client-web\/src$/),
        dev: nodeEnv === 'development',
      })
      expect(nextApp.prepare).toBeCalled()
    }
  )
})
