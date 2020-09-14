import next from 'next'

import createNextApp from './createNextApp'

jest.mock('next', () =>
  jest.fn(() => ({
    prepare: jest.fn().mockResolvedValue(),
  }))
)

describe.each(['production', 'development'])('createNextApp', (env) => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it(`should instantiate next.js (${env})`, async () => {
    process.env.NODE_ENV = env
    const nextApp = await createNextApp()
    expect(next).toBeCalledWith({
      dir: expect.stringMatching(/packages\/client-web\/src$/),
      dev: env !== 'production',
    })
    expect(nextApp.prepare).toBeCalled()
  })
})
