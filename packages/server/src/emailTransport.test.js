/* eslint-disable global-require */

let nodemailer
let getLogger
let emailTransport

const mockTransport = { sendMail: jest.fn().mockResolvedValue() }

const resetImports = () => {
  jest.resetModules()
  jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => mockTransport),
  }))
  jest.mock('./logger')
  nodemailer = require('nodemailer')
  getLogger = require('./logger').default
  emailTransport = require('./emailTransport').default
}

beforeEach(() => {
  jest.clearAllMocks()
  resetImports()
})

describe('emailTransport', () => {
  it('should return singleton', () => {
    const transport1 = emailTransport({ host: 'smtp.example.com', port: 25, skipMails: false })
    const transport2 = emailTransport({ host: 'smtp.example.com', port: 25, skipMails: false })
    expect(transport1).toBe(transport2)
  })

  it('should create transport with auth', () => {
    const transport = emailTransport({
      host: 'smtp.example.com',
      port: 25,
      user: 'alice@example.com',
      password: 's3cr3t',
      senderAddress: 'sender@example.com',
      skipMails: false,
    })
    expect(transport).toBe(mockTransport)
    expect(nodemailer.createTransport).toBeCalledTimes(1)
    expect(nodemailer.createTransport).toBeCalledWith(
      {
        host: 'smtp.example.com',
        port: 25,
        secure: false,
        auth: { user: 'alice@example.com', pass: 's3cr3t' },
      },
      { from: 'sender@example.com' }
    )
  })

  it('should create transport w/o auth', () => {
    const transport = emailTransport({
      host: 'smtp.example.com',
      port: 25,
      senderAddress: 'sender@example.com',
      skipMails: false,
    })
    expect(transport).toBe(mockTransport)
    expect(nodemailer.createTransport).toBeCalledTimes(1)
    expect(nodemailer.createTransport).toBeCalledWith(
      {
        host: 'smtp.example.com',
        port: 25,
        secure: false,
      },
      { from: 'sender@example.com' }
    )
  })

  it('should provide sendMail wrapper function that logs', async () => {
    expect.assertions(2)
    const transport = emailTransport({ host: 'smtp.example.com', port: 25, skipMails: false })
    expect(transport.sendMail).toBeInstanceOf(Function)
    const sendMailOpts = { to: 'bob@example.com', subject: 'Test' }
    await transport.sendMail(sendMailOpts)
    expect(getLogger('email').info).toBeCalledWith('To: bob@example.com Subject: "Test"')
  })

  it('should provide dummy sendMail if skipMails=true', async () => {
    expect.assertions(2)
    const transport = emailTransport({ host: 'smtp.example.com', port: 25, skipMails: true })
    expect(transport.sendMail).toBeInstanceOf(Function)
    await transport.sendMail({})
    expect(getLogger('email').info).not.toBeCalled()
  })
})
