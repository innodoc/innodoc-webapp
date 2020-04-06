import mongoose from 'mongoose'
import request from 'supertest'

import createExpressApp from '../createExpressApp'
import connectDb from '../db'
import User, { tokenRegexp as tokenRegexpString } from '../models/User'

const mockNoopMiddleware = (req, res, next) => next()

jest.mock('csurf', () => () => mockNoopMiddleware)

const mockT = jest.fn((s) => s)
jest.mock('next-i18next/middleware', () => () => (req, res, next) => {
  req.t = mockT
  next()
})

jest.mock('@innodoc/client-misc/src/i18n', () => {})

jest.mock('./nextController', () => () => mockNoopMiddleware)

const mockSendMail = jest.fn().mockResolvedValue()
jest.mock('../middlewares/sendMailMiddleware', () => () => (req, res, next) => {
  req.app.locals.sendMail = mockSendMail
  next()
})

const tokenRegexp = new RegExp(tokenRegexpString)

const config = {
  appRoot: 'https://app.example.com/',
  jwtSecret: '123ABCabc!',
  mongoUrl: process.env.MONGO_URL,
  nodeEnv: 'testing',
  smtp: {
    host: 'smtp.ethereal.email',
    port: 587,
    user: 'dejon.jacobs@ethereal.email',
    password: 'p19wsAPP2Qn9MQ8BNP',
    senderAddress: 'no-reply@example.com',
  },
}

describe('userController', () => {
  beforeAll(() => connectDb(config))
  afterAll(() => mongoose.disconnect())
  beforeEach(async () => jest.clearAllMocks())

  const getRandEmail = () => {
    const randString = Math.random().toString(36).substring(2)
    return `alice-usercontroller-${randString}@example.com`
  }

  const addTestUser = async () => {
    const user = User({
      email: getRandEmail(),
      emailVerified: true,
    })
    await user.setPassword('g00dPassword!')
    await user.save()
    return user.email
  }

  const createAccessTokenCookie = async (opts) => {
    const accessToken =
      opts.accessToken ||
      opts.user.generateAccessToken(config.jwtSecret, config.appRoot)
    return `accessToken=${accessToken};HttpOnly`
  }

  const testPost = async ({ url, params, status, type, accessTokenCookie }) =>
    request(await createExpressApp(config, {}))
      .post(url)
      .set('Cookie', [accessTokenCookie])
      .send(params)
      .then((res) => {
        expect(res.status).toBe(status)
        if (type) {
          expect(res.type).toMatch(new RegExp(type))
        }
        if (status === 200 && type === 'json') {
          expect(res.body.result).toBe('ok')
        }
        return res
      })

  const expectJwt401 = (url) => {
    test('401 w/o access token', async () => {
      await addTestUser()
      return testPost({
        url,
        status: 401,
      })
    })

    test('401 with invalid access token', async () => {
      await addTestUser()
      return testPost({
        url,
        status: 401,
        accessTokenCookie: await createAccessTokenCookie({
          accessToken: 'b0rken.accessToken',
        }),
      })
    })
  }

  describe('POST /user/check-email', () => {
    test("200 if email doesn't exist", () =>
      testPost({
        url: '/user/check-email',
        params: { email: 'alice-usercontroller-does-not-exist@example.com' },
        status: 200,
      }))

    test('400 if email already exists', async () => {
      const email = await addTestUser()
      return testPost({
        url: '/user/check-email',
        params: { email },
        status: 400,
        type: 'json',
      }).then((res) => expect(res.body.result).toBe('UserExistsError'))
    })
  })

  describe('POST /user/register', () => {
    test('200', () => {
      const email = getRandEmail()
      return testPost({
        url: '/user/register',
        params: {
          email,
          password: 'g00dPassword!',
        },
        status: 200,
        type: 'json',
      }).then(async () => {
        const mail = mockSendMail.mock.calls[0][0]
        expect(mail).toMatchObject({
          subject: expect.any(String),
          text: expect.any(String),
          to: email,
        })
        const user = await User.findOne({ email })
        expect(user.emailVerified).toBe(false)
        expect(user.emailVerificationToken).toMatch(tokenRegexp)
      })
    })

    test('400 if email exists', async () => {
      const email = await addTestUser()
      return testPost({
        url: '/user/register',
        params: { email, password: 'g00dPassword!' },
        status: 400,
        type: 'json',
      }).then(async (res) => {
        expect(res.body.result).toBe('UserExistsError')
      })
    })

    test('500 if sending email fails', async () => {
      const email = getRandEmail()
      mockSendMail.mockImplementation(() => {
        throw Error('Sending mail failed')
      })
      return testPost({
        url: '/user/register',
        params: {
          email,
          password: 'g00dPassword!',
        },
        status: 500,
        type: 'json',
      }).then(async () => expect(await User.findOne({ email })).toBeNull())
    })
  })

  describe('POST /user/login', () => {
    test('200 with valid credentials', async () => {
      const email = await addTestUser()
      return testPost({
        url: '/user/login',
        params: { email, password: 'g00dPassword!' },
        status: 200,
        type: 'json',
      }).then((res) => {
        const cookie = res.headers['set-cookie'][0]
        expect(cookie).toMatch(
          /accessToken=[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/
        )
        expect(cookie).toMatch('HttpOnly')
      })
    })

    test.each([
      [
        'w/o valid',
        { email: 'alice-usercontroller@example.com', password: 'secret' },
        401,
      ],
      ['w/o', {}, 400],
      ['with password only', { password: 'secret' }, 400],
    ])('400 %s credentials', async (_, params, status) => {
      await addTestUser()
      return testPost({ url: '/user/login', params, status }).then((res) =>
        expect(res.headers).not.toHaveProperty('set-cookie')
      )
    })
  })

  describe('POST /user/logout', () => {
    test('200 with valid access token', async () => {
      const email = await addTestUser()
      const user = await User.findOne({ email })
      return testPost({
        url: '/user/logout',
        status: 200,
        type: 'json',
        accessTokenCookie: await createAccessTokenCookie({ user }),
      }).then((res) => {
        expect(
          res.headers['set-cookie'].some((cookie) =>
            cookie.includes('accessToken=;')
          )
        ).toBe(true)
      })
    })

    expectJwt401('/user/logout')
  })

  describe('POST /user/change-password', () => {
    test('200 with valid access token', async () => {
      const email = await addTestUser()
      const user = await User.findOne({ email })
      return testPost({
        url: '/user/change-password',
        params: { password: 'newG00dPassword!', oldPassword: 'g00dPassword!' },
        status: 200,
        type: 'json',
        accessTokenCookie: await createAccessTokenCookie({ user }),
      }).then(async () => {
        const updatedUser = await User.findOne({ email }).select('hash salt')
        expect(updatedUser.hash).not.toEqual(user.hash)
        expect(updatedUser.salt).not.toEqual(user.salt)
      })
    })

    test('400 with valid access token but wrong old password', async () => {
      const email = await addTestUser()
      const user = await User.findOne({ email }).select('+hash +salt')
      return testPost({
        url: '/user/change-password',
        params: { password: 'newG00dPassword!', oldPassword: 'wr0ngPassword!' },
        status: 400,
        type: 'json',
        accessTokenCookie: await createAccessTokenCookie({ user }),
      }).then(async () => {
        const updatedUser = await User.findOne({ email }).select('hash salt')
        // console.log(updatedUser)
        expect(updatedUser.hash).toEqual(user.hash)
        expect(updatedUser.salt).toEqual(user.salt)
      })
    })

    test("400 if user doesn't exist", async () => {
      const email = await addTestUser()
      const user = await User.findOne({ email })
      const accessTokenCookie = await createAccessTokenCookie({ user })
      await user.delete()
      return testPost({
        url: '/user/change-password',
        params: { password: 'newG00dPassword!', oldPassword: 'g00dPassword!' },
        status: 400,
        type: 'json',
        accessTokenCookie,
      })
    })

    expectJwt401('/user/change-password')
  })

  describe('POST /user/reset-password', () => {
    const expectPwdChanged = (a, b) => {
      expect(b.hash).not.toEqual(a.hash)
      expect(b.salt).not.toEqual(a.salt)
      expect(b.passwordResetToken).toBeUndefined()
      expect(b.passwordResetExpires).toBeUndefined()
    }
    const expectPwdUnchanged = (a, b) => {
      expect(b.hash).toBe(a.hash)
      expect(b.salt).toBe(a.salt)
      expect(b.passwordResetToken).toEqual(a.passwordResetToken)
      expect(b.passwordResetExpires).toEqual(a.passwordResetExpires)
    }

    test.each([
      [200, 'with valid token', expectPwdChanged, undefined],
      [400, 'with invalid token', expectPwdUnchanged, { token: 'wr0ng' }],
      [400, 'w/o token', expectPwdUnchanged, { token: undefined }],
      [
        400,
        'with expired token',
        expectPwdUnchanged,
        { expires: Date.now() - 60 * 1000 },
      ],
      [400, "if user doesn't exist", () => {}, { noUser: true }],
    ])('%s %s', async (status, _, expFunc, opts = {}) => {
      const token = User.generateToken()
      let user
      if (!opts.noUser) {
        const email = await addTestUser()
        user = await User.findOne({ email }).select('+hash +salt')
        user.passwordResetToken = token
        user.passwordResetExpires = opts.expires
          ? opts.expires
          : Date.now() + 60 * 60 * 1000
        await user.save()
      }
      const params = { password: 'newG00dPassword!' }
      if (Object.prototype.hasOwnProperty.call(opts, 'token')) {
        if (opts.token) {
          params.token = opts.token
        }
      } else {
        params.token = token
      }
      return testPost({
        url: '/user/reset-password',
        params,
        status,
        type: 'json',
      }).then(async () => {
        if (user) {
          const updatedUser = await User.findOne({ email: user.email }).select(
            '+hash +salt'
          )
          expFunc(user, updatedUser)
        }
      })
    })
  })

  describe('POST /user/verify', () => {
    test.each([
      [200, 'with valid token', true, {}],
      [400, 'with invalid token', false, { token: 'wr0ng' }],
      [400, 'w/o token', false, { noToken: true }],
      [400, 'if already verified', true, { emailVerified: true }],
      [400, "if user doesn't exist", false, { noUser: true }],
    ])('%s %s', async (status, _, verified, opts) => {
      const token = User.generateToken()
      let user
      if (!opts.noUser) {
        const email = await addTestUser()
        user = await User.findOne({ email })
        user.emailVerificationToken = token
        user.emailVerified = opts.emailVerified || false
        await user.save()
      }
      const params = {}
      if (!opts.noToken) {
        params.token = opts.token || token
      }
      return testPost({
        url: '/user/verify',
        params,
        status,
        type: 'json',
      }).then(async () => {
        if (user) {
          const updatedUser = await User.findOne({ email: user.email })
          expect(updatedUser.emailVerified).toBe(verified)
        }
      })
    })
  })

  describe('POST /user/request-password-reset', () => {
    const expSuccess = (user) => {
      expect(user.passwordResetToken).toMatch(tokenRegexp)
      expect(user.passwordResetExpires.getTime()).toBeGreaterThan(Date.now())
      const mail = mockSendMail.mock.calls[0][0]
      expect(mail).toMatchObject({
        subject: expect.any(String),
        text: expect.any(String),
        to: user.email,
      })
    }

    const expFailure = (user, { emailSendingFails }) => {
      expect(user.passwordResetToken).toBeUndefined()
      expect(user.passwordResetExpires).toBeUndefined()
      expect(mockSendMail.mock.calls).toHaveLength(emailSendingFails ? 1 : 0)
    }

    test.each([
      [200, 'with valid email', expSuccess, {}],
      [400, 'with wrong email', expFailure, { email: 'alliice@example.com' }],
      [
        400,
        "if user doesn't exist",
        null,
        { email: 'alice-usercontroller@example.com', noUser: true },
      ],
      [500, 'if email sending fails', expFailure, { emailSendingFails: true }],
      [400, 'if not verified', expFailure, { emailVerified: false }],
    ])('%s %s', async (status, _, expFunc, opts) => {
      if (opts.emailSendingFails) {
        mockSendMail.mockRejectedValue(new Error())
      } else {
        mockSendMail.mockResolvedValue()
      }
      let user
      if (!opts.noUser) {
        const email = await addTestUser()
        user = await User.findOne({ email })
        if (Object.prototype.hasOwnProperty.call(opts, 'emailVerified')) {
          user.emailVerified = opts.emailVerified
          await user.save()
        }
      }
      return testPost({
        url: '/user/request-password-reset',
        params: { email: opts.email || user.email },
        status,
        type: 'json',
      }).then(async () => {
        if (user) {
          const updatedUser = await User.findOne({ email: user.email })
          expFunc(updatedUser, opts)
        }
      })
    })
  })

  describe('POST /user/request-verification', () => {
    const expSuccess = (user) => {
      const mail = mockSendMail.mock.calls[0][0]
      expect(mail).toMatchObject({
        subject: expect.any(String),
        text: expect.any(String),
        to: user.email,
      })
    }
    const expFailure = (user, { emailSendingFails }) => {
      expect(mockSendMail.mock.calls).toHaveLength(emailSendingFails ? 1 : 0)
    }

    test.each([
      [200, 'with valid email', expSuccess, {}],
      [400, 'with wrong email', expFailure, { email: 'alliice@example.com' }],
      [
        400,
        "if user doesn't exist",
        null,
        { email: 'alice-usercontroller@example.com', noUser: true },
      ],
      [500, 'if email sending fails', expFailure, { emailSendingFails: true }],
      [400, 'if user is already verified', expFailure, { emailVerified: true }],
    ])('%s %s', async (status, _, expFunc, opts) => {
      if (opts.emailSendingFails) {
        mockSendMail.mockRejectedValue(new Error())
      }
      let user
      if (!opts.noUser) {
        const email = await addTestUser()
        user = await User.findOne({ email })
        user.emailVerificationToken = User.generateToken()
        user.emailVerified = opts.emailVerified || false
        await user.save()
      }
      return testPost({
        url: '/user/request-verification',
        params: { email: opts.email || user.email },
        status,
        type: 'json',
      }).then(async () => {
        if (user) {
          const updatedUser = await User.findOne({ email: user.email })
          expFunc(updatedUser, opts)
        }
      })
    })
  })
})
