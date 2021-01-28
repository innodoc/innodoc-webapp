import request from 'supertest'

import createExpressApp from './createExpressApp'
import { connectDb, disconnectDb } from './db'
import User, { tokenRegexp as tokenRegexpString } from './models/User'
import UserProgress from './models/UserProgress'

const mockNoopMiddleware = (req, res, next) => next()

jest.mock('csurf', () => () => mockNoopMiddleware)

jest.mock('@innodoc/common/src/i18n')

jest.mock('i18next-http-middleware', () => ({
  handle: (i18n) => (req, res, next) => {
    req.t = i18n.t
    next()
  },
}))

const mockSendMail = jest.fn().mockResolvedValue()
jest.mock('./middlewares/sendMailMiddleware', () => () => (req, res, next) => {
  req.app.locals.sendMail = mockSendMail
  next()
})

const mockNextApp = { getRequestHandler: jest.fn(() => mockNoopMiddleware) }

const tokenRegexp = new RegExp(tokenRegexpString)

const config = {
  appRoot: 'https://app.example.com/',
  jwtSecret: '123ABCabc!',
  manifest: { home_link: '/page/foo' },
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
  afterAll(disconnectDb)
  beforeEach(async () => jest.clearAllMocks())

  const getRandEmail = () => {
    const randString = Math.random().toString(36).substring(2)
    return `alice-usercontroller-${randString}@example.com`
  }

  const addTestUser = async (addProgress = true) => {
    const user = User({
      email: getRandEmail(),
      emailVerified: true,
    })
    await user.setPassword('g00dPassword!')
    await user.save()
    if (addProgress) {
      const userProgress = UserProgress({
        user_id: user._id,
        answeredQuestions: [],
        testScores: { 'section/foo': 32 },
        visitedSections: ['section/foo'],
      })
      await userProgress.save()
    }
    return user.email
  }

  const createAccessTokenCookie = async (opts) => {
    const accessToken =
      opts.accessToken || opts.user.generateAccessToken(config.jwtSecret, config.appRoot)
    return `accessToken=${accessToken};HttpOnly`
  }

  const testReq = async ({ accessTokenCookie, method, params, status, type, url }) => {
    let req = request(await createExpressApp(config, mockNextApp))
    req = method === 'get' ? req.get(url) : req.post(url)
    return req
      .set('Cookie', [accessTokenCookie])
      .set('X-Requested-With', type === 'json' ? 'XMLHttpRequest' : null)
      .send(params)
      .then((res) => {
        if (res.status !== status) {
          let errorResult
          try {
            errorResult = JSON.parse(res.text).result
          } catch {
            errorResult = res.text
          }
          console.error(`${res.error.message}\n${errorResult}`) // eslint-disable-line no-console
        }
        expect(res.status).toBe(status)
        if (type) {
          expect(res.type).toMatch(new RegExp(type))
        }
        if (status === 200 && type === 'json') {
          expect(res.body.result).toBe('ok')
        }
        return res
      })
  }

  const testGet = (args) => testReq({ method: 'get', ...args })
  const testPost = (args) => testReq({ method: 'post', ...args })

  const expectJwt401 = (url, method = 'post') => {
    test('401 w/o access token', async () => {
      await addTestUser()
      return testReq({
        method,
        url,
        status: 401,
      })
    })

    test('401 with invalid access token', async () => {
      await addTestUser()
      return testReq({
        method,
        url,
        status: 401,
        accessTokenCookie: await createAccessTokenCookie({
          accessToken: 'b0rken.accessToken',
        }),
      })
    })
  }

  describe('GET /user/progress', () => {
    test('200 with progress', async () => {
      const email = await addTestUser()
      const user = await User.findOne({ email })
      return testGet({
        url: '/user/progress',
        accessTokenCookie: await createAccessTokenCookie({ user }),
        status: 200,
        type: 'json',
      }).then((res) => {
        expect(res.body).toEqual({
          result: 'ok',
          progress: {
            answeredQuestions: [],
            testScores: { 'section/foo': 32 },
            visitedSections: ['section/foo'],
          },
        })
      })
    })

    test('200 w/o progress', async () => {
      const email = await addTestUser(false)
      const user = await User.findOne({ email })
      return testGet({
        accessTokenCookie: await createAccessTokenCookie({ user }),
        status: 200,
        type: 'json',
        url: '/user/progress',
      }).then((res) => {
        expect(res.body).toEqual({
          result: 'ok',
          progress: null,
        })
      })
    })

    expectJwt401('/user/progress', 'get')
  })

  describe('POST /user/progress', () => {
    test('200', async () => {
      const email = await addTestUser(false)
      const user = await User.findOne({ email })
      return testPost({
        accessTokenCookie: await createAccessTokenCookie({ user }),
        params: {
          progress: {
            answeredQuestions: [],
            testScores: { 'section/bar': 4 },
            visitedSections: ['section/foo', 'section/bar'],
          },
        },
        status: 200,
        type: 'json',
        url: '/user/progress',
      }).then(async () => {
        const progress = await UserProgress.find({ user_id: user._id })
        expect(progress).toHaveLength(1)
        const testScoresIter = progress[0].testScores.entries()
        const testScore = testScoresIter.next().value
        expect(testScore[0]).toBe('section/bar')
        expect(testScore[1]).toBe(4)
        expect(testScoresIter.next().done).toBe(true)
        expect(progress[0].visitedSections).toHaveLength(2)
        expect(progress[0].visitedSections[0]).toBe('section/foo')
        expect(progress[0].visitedSections[1]).toBe('section/bar')
      })
    })

    test('400 with malformed data', async () => {
      const email = await addTestUser(false)
      const user = await User.findOne({ email })
      return testPost({
        accessTokenCookie: await createAccessTokenCookie({ user }),
        params: {
          progress: { answeredQuestions: [] },
        },
        status: 400,
        type: 'json',
        url: '/user/progress',
      }).then(async (res) => {
        const progress = await UserProgress.find({ user_id: user._id })
        expect(progress).toHaveLength(0)
        expect(res.body.result).toBe('MalformedRequest')
      })
    })

    expectJwt401('/user/progress')
  })

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

  describe('POST /user/delete-account', () => {
    test('200', async () => {
      const email = await addTestUser()
      const user = await User.findOne({ email })
      const userId = user._id
      return testPost({
        url: '/user/delete-account',
        params: { password: 'g00dPassword!' },
        status: 200,
        type: 'json',
        accessTokenCookie: await createAccessTokenCookie({ user }),
      }).then(async (res) => {
        expect(res.headers['set-cookie'].some((cookie) => cookie.includes('accessToken=;'))).toBe(
          true
        )
        expect(await User.findOne({ email })).toBeFalsy()
        expect(await UserProgress.findOne({ user_id: userId })).toBeFalsy()
      })
    })

    test('400 with wrong password', async () => {
      const email = await addTestUser()
      const user = await User.findOne({ email })
      return testPost({
        url: '/user/delete-account',
        params: { password: 'BadPassword!' },
        status: 400,
        type: 'json',
        accessTokenCookie: await createAccessTokenCookie({ user }),
      }).then((res) => {
        expect(res.body.result).toBe('DeleteAccountError')
      })
    })

    expectJwt401('/user/delete-account')
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
        expect(cookie).toMatch(/accessToken=[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/)
        expect(cookie).toMatch('HttpOnly')
      })
    })

    test.each([
      ['w/o valid', { email: 'alice-usercontroller@example.com', password: 'secret' }, 401],
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
        expect(res.headers['set-cookie'].some((cookie) => cookie.includes('accessToken=;'))).toBe(
          true
        )
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
        expect(updatedUser.hash).toEqual(user.hash)
        expect(updatedUser.salt).toEqual(user.salt)
      })
    })

    test("401 if user doesn't exist", async () => {
      const email = await addTestUser()
      const user = await User.findOne({ email })
      const accessTokenCookie = await createAccessTokenCookie({ user })
      await user.delete()
      return testPost({
        url: '/user/change-password',
        params: { password: 'newG00dPassword!', oldPassword: 'g00dPassword!' },
        status: 401,
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
      [400, 'with expired token', expectPwdUnchanged, { expires: Date.now() - 60 * 1000 }],
      [400, "if user doesn't exist", () => {}, { noUser: true }],
    ])('%s %s', async (status, _, expFunc, opts = {}) => {
      const token = User.generateToken()
      let user
      if (!opts.noUser) {
        const email = await addTestUser()
        user = await User.findOne({ email }).select('+hash +salt')
        user.passwordResetToken = token
        user.passwordResetExpires = opts.expires ? opts.expires : Date.now() + 60 * 60 * 1000
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
          const updatedUser = await User.findOne({ email: user.email }).select('+hash +salt')
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
