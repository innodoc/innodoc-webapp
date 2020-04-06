import mongoose from 'mongoose'

import connectDb from '../db'
import User, { tokenRegexp } from './User'

describe('User', () => {
  beforeAll(() =>
    connectDb({ mongoUrl: process.env.MONGO_URL, nodeEnv: 'production' })
  )

  afterAll(() => mongoose.disconnect())

  const getRandEmail = () => {
    const randString = Math.random().toString(36).substring(2)
    return `alice-user-${randString}@example.com`
  }

  const addTestUser = async () => {
    const user = User({
      email: getRandEmail(),
      emailVerificationToken: '123vtoken!',
      emailVerified: false,
      passwordResetExpires: Date.now(),
      passwordResetToken: '123ptoken!',
    })
    await user.setPassword('g00dPassword!')
    await user.save()
    return user
  }

  it('should have mongoose schema', async () => {
    const user = await addTestUser()
    expect(user.email).toMatch(/^alice-user-.+@example\.com$/)
    expect(user.emailVerificationToken).toBe('123vtoken!')
    expect(user.emailVerified).toBe(false)
    expect(user.passwordResetExpires.getTime()).toBeLessThanOrEqual(Date.now())
    expect(user.passwordResetToken).toBe('123ptoken!')
  })

  it('should use salt and hash for password', async () => {
    const user = await addTestUser()
    expect(typeof user.salt).toBe('string')
    expect(user.salt.length).toBeTruthy()
    expect(typeof user.hash).toBe('string')
    expect(user.hash.length).toBeTruthy()
  })

  it('should reject weak password', async () => {
    expect.assertions(1)
    const newUser = new User({ email: 'weakpwd-user@example.com' })
    return expect(newUser.setPassword('123456')).rejects.toThrow(
      /passwordValidationError/
    )
  })

  it('should have unique email field', async () => {
    expect.assertions(1)
    const user = await addTestUser()
    const anotherAlice = new User({ email: user.email })
    return expect(anotherAlice.save()).rejects.toThrow(/duplicate/)
  })

  it('should force lower-case for email field', async () => {
    expect.assertions(1)
    const user = await addTestUser()
    const anotherAlice = new User({ email: user.email.toUpperCase() })
    return expect(anotherAlice.save()).rejects.toThrow(/duplicate/)
  })

  it('should have emailVerified=false as default', async () => {
    const email = getRandEmail()
    await User({ email }).save()
    const user = await User.findOne({ email })
    expect(user.emailVerified).toBe(false)
  })

  it('should use passportLocalMongoose plugin', async () => {
    const user = await addTestUser()
    const methods = ['setPassword', 'changePassword']
    methods.forEach((name) => expect(typeof user[name]).toBe('function'))
    const staticMethods = [
      'authenticate',
      'serializeUser',
      'deserializeUser',
      'register',
      'findByUsername',
      'createStrategy',
    ]
    staticMethods.forEach((name) => expect(typeof User[name]).toBe('function'))
  })

  describe('methods', () => {
    test('generateVerificationToken', async () => {
      const user = await addTestUser()
      const jwt = await user.generateAccessToken(
        'jwtSecret123',
        'https://example.com/'
      )
      expect(jwt).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
      )
    })
  })

  describe('static methods', () => {
    test('findByUsername should only return verified users', async () => {
      const unverifiedUser = await addTestUser()
      const verifiedUser = new User({
        email: getRandEmail(),
        emailVerified: true,
      })
      await verifiedUser.save()

      expect((await User.findByUsername(verifiedUser.email)).email).toBe(
        verifiedUser.email
      )
      expect(await User.findByUsername(unverifiedUser.email)).toBeNull()
    })

    test('generateToken', () => {
      expect(User.generateToken()).toMatch(new RegExp(tokenRegexp))
    })
  })
})
