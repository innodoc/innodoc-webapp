import sendMailMiddleware from './sendMailMiddleware'

let mockSendMail = jest.fn()
jest.mock('../emailTransport', () =>
  jest.fn(() => ({
    sendMail: (params) => mockSendMail(params),
  }))
)

describe('sendMailMiddleware', () => {
  const middleware = sendMailMiddleware({
    host: 'smtp.example.com',
    port: 587,
    user: 'alice',
    password: 's3cr3t',
    senderAddress: 'no-reply@example.com',
  })
  const req = { app: { locals: {} } }
  const next = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    middleware(req, {}, next)
  })

  it('should send mails', async () => {
    expect.assertions(1)
    mockSendMail = jest.fn().mockResolvedValue()
    await req.app.locals.sendMail({
      to: 'bob@example.com',
      subject: 'Test subject',
      text: 'Test content',
    })
    expect(mockSendMail).toBeCalledWith({
      to: 'bob@example.com',
      subject: 'Test subject',
      text: 'Test content',
    })
  })
})
