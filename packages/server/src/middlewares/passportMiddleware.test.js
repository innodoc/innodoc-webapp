import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'

import passportMiddleware, {
  jwtFromRequest,
  verify,
} from './passportMiddleware'

const mockJwtStrategy = {}
jest.mock('passport-jwt', () => ({
  Strategy: jest.fn(() => mockJwtStrategy),
}))
jest.mock('passport')

const mockDeserializeUser = {}
const mockSerializeUser = {}
const mockUserStrategy = {}
jest.mock('../models/User', () => ({
  createStrategy: jest.fn(() => mockUserStrategy),
  deserializeUser: jest.fn(() => mockDeserializeUser),
  serializeUser: jest.fn(() => mockSerializeUser),
}))

const config = {
  appRoot: 'http://app.example.com/',
  jwtSecret: 'jwtsecret123',
}

describe('passportMiddleware', () => {
  it('should initialize passport', () => {
    const middleware = passportMiddleware(config)
    expect(JwtStrategy).toBeCalledWith(
      {
        issuer: 'http://app.example.com/',
        jwtFromRequest,
        secretOrKey: 'jwtsecret123',
      },
      verify
    )
    expect(passport.initialize).toBeCalled()
    expect(passport.use).toBeCalledWith(mockJwtStrategy)
    expect(passport.use).toBeCalledWith(mockUserStrategy)
    expect(passport.serializeUser).toBeCalledWith(mockSerializeUser)
    expect(passport.deserializeUser).toBeCalledWith(mockDeserializeUser)
    expect(middleware).toBe(passport.initialize.mock.results[0].value)
  })
})

describe('jwtStrategy', () => {
  describe('jwtFromRequest', () => {
    it.each([
      [{ cookies: { accessToken: '123AccessToken' } }, '123AccessToken'],
      [{ cookies: { other: 'cookie' } }, undefined],
      [{ cookies: {} }, undefined],
      [{}, undefined],
      [undefined, undefined],
    ])('should extract access token from request: %s', (req, exp) => {
      expect(jwtFromRequest(req)).toBe(exp)
    })
  })

  describe('verify', () => {
    it('should call done with sub', () => {
      const ret = {}
      const done = jest.fn(() => ret)
      expect(verify({ sub: 'alice@example.com' }, done)).toBe(ret)
      expect(done).toBeCalledTimes(1)
      expect(done).toBeCalledWith(null, 'alice@example.com')
    })

    it('should call done with error', () => {
      const err = new Error()
      const ret = {}
      const done = jest
        .fn()
        .mockImplementationOnce(() => {
          throw err
        })
        .mockImplementationOnce(() => ret)
      expect(verify({ sub: 'alice@example.com' }, done)).toBe(ret)
      expect(done).toBeCalledTimes(2)
      expect(done).toBeCalledWith(null, 'alice@example.com')
      expect(done).toBeCalledWith(err)
    })
  })
})
