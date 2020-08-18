import nodemailer from 'nodemailer'

import sendMailMiddleware from './sendMailMiddleware'

// TODO update

let mockSendMail
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: (params) => mockSendMail(params),
  })),
}))

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

  it('should call createTransport and provide sendMail function', () => {
    expect(req.app.locals.sendMail).toBeInstanceOf(Function)
    expect(nodemailer.createTransport).toBeCalledWith({
      host: 'smtp.example.com',
      port: 587,
      auth: {
        user: 'alice',
        pass: 's3cr3t',
      },
    })
    expect(next).toBeCalled()
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
      from: 'no-reply@example.com',
    })
  })

  it('should fail to send mails', () => {
    mockSendMail = jest.fn().mockRejectedValue(new Error('Test error'))
    return expect(
      req.app.locals.sendMail({
        to: 'bob@example.com',
        subject: 'Test subject',
        text: 'Test content',
      })
    ).rejects.toThrow('Test error')
  })
})

describe('sendMailMiddleware (skipMails=true)', () => {
  const middleware = sendMailMiddleware({ skipMails: true })
  const req = { app: { locals: {} } }
  const next = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    middleware(req, {}, next)
  })

  it('should not call createTransport', () => {
    expect(req.app.locals.sendMail).toBeInstanceOf(Function)
    expect(nodemailer.createTransport).not.toBeCalled()
    expect(next).toBeCalled()
  })
})
