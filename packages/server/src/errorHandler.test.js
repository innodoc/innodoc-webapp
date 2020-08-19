import errorHandler from './errorHandler'
import getLogger from './logger'

jest.mock('./logger')

const mockSendMail = jest.fn()
jest.mock('./emailTransport', () =>
  jest.fn(() => ({
    sendMail: (params) => mockSendMail(params),
  }))
)

const defaultConfig = {
  appRoot: 'https://app.example.com/',
  logErrorEmail: 'admin@example.com',
  nodeEnv: 'production',
  smtp: {},
}

const req = { path: '/foo/bar', xhr: false }
const res = {
  headersSent: false,
  json: jest.fn(),
  locals: { loggedInEmail: 'alice@example.com' },
  send: jest.fn(),
  status: jest.fn(),
}
const next = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

describe('errorHandler', () => {
  describe('calling next()', () => {
    it('should call next() if headers were sent', async () => {
      expect.assertions(1)
      const handler = errorHandler(defaultConfig)
      await handler(new Error('foo error'), req, { ...res, headersSent: true }, next)
      expect(next).toBeCalled()
    })

    it("should not call next() if headers weren't sent", async () => {
      expect.assertions(1)
      const handler = errorHandler(defaultConfig)
      await handler(new Error('foo error'), req, res, next)
      expect(next).not.toBeCalled()
    })
  })

  it('should log error on request logger', async () => {
    expect.assertions(2)
    const handler = errorHandler(defaultConfig)
    await handler(new Error('foo error'), req, res, next)
    const logMsg = getLogger('request').error.mock.calls[0][0]
    expect(logMsg).toMatch('Exception occured. user: alice@example.com path: /foo/bar')
    expect(logMsg).toMatch('Error: foo error')
  })

  describe('error mail', () => {
    it('should send mail (production)', async () => {
      expect.assertions(4)
      const handler = errorHandler(defaultConfig)
      await handler(new Error('foo error'), req, res, next)
      const sendMailOpts = mockSendMail.mock.calls[0][0]
      expect(sendMailOpts.subject).toBe('Exception on https://app.example.com/: Error')
      expect(sendMailOpts.text).toMatch('Exception occured. user: alice@example.com path: /foo/bar')
      expect(sendMailOpts.text).toMatch('Error: foo error')
      expect(sendMailOpts.to).toBe('admin@example.com')
    })

    it('should not send mail (development)', async () => {
      expect.assertions(1)
      const handler = errorHandler({ ...defaultConfig, nodeEnv: 'development' })
      await handler(new Error('foo error'), req, res, next)
      expect(mockSendMail).not.toBeCalled()
    })
  })

  describe('status', () => {
    it('should use status code from error', async () => {
      expect.assertions(1)
      const handler = errorHandler(defaultConfig)
      const err = new Error('foo error')
      err.status = 567
      await handler(err, req, res, next)
      expect(res.status).toBeCalledWith(567)
    })

    it('should use status code 500 as default', async () => {
      expect.assertions(1)
      const handler = errorHandler(defaultConfig)
      await handler(new Error('foo error'), req, res, next)
      expect(res.status).toBeCalledWith(500)
    })
  })

  describe('client respond', () => {
    describe.each([true, false])('xhr=%s', (xhr) => {
      it('should not leak error (production)', async () => {
        expect.assertions(xhr ? 2 : 1)
        const handler = errorHandler(defaultConfig)
        await handler(new Error('foo error'), { ...req, xhr }, res, next)
        if (xhr) {
          const resp = res.json.mock.calls[0][0]
          expect(resp.result).toBe('error')
          expect(resp.msg).not.toMatch('Error: foo error')
        } else {
          expect(res.send.mock.calls[0][0]).not.toMatch('Error: foo error')
        }
      })

      it('should show error (development)', async () => {
        expect.assertions(xhr ? 2 : 1)
        const handler = errorHandler({ ...defaultConfig, nodeEnv: 'development' })
        await handler(new Error('foo error'), { ...req, xhr }, res, next)
        if (xhr) {
          const resp = res.json.mock.calls[0][0]
          expect(resp.result).toBe('error')
          expect(resp.msg).toMatch('Error: foo error')
        } else {
          expect(res.send.mock.calls[0][0]).toMatch('Error: foo error')
        }
      })
    })
  })
})
