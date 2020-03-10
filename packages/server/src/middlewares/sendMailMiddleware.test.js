import nodemailer from 'nodemailer'

import sendMailMiddleware from './sendMailMiddleware'

const mockTransporter = {}
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => mockTransporter),
}))

describe('sendMailMiddleware', () => {
  it('should call createTransport and return transporter', () => {
    const middleware = sendMailMiddleware({
      host: 'smtp.example.com',
      port: 587,
      user: 'alice',
      password: 's3cr3t',
      senderAddress: 'no-reply@example.com',
    })
    const req = { app: { locals: {} } }
    const next = jest.fn()
    middleware(req, {}, next)
    expect(req.app.locals.mailTransporter).toBe(mockTransporter)
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
})
