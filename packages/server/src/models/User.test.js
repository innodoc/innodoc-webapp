import mongoose from 'mongoose'

import connectDb from '../db'
import User, { tokenRegexp } from './User'

describe('User', () => {
  let user

  beforeAll(() =>
    connectDb({ mongoUrl: process.env.MONGO_URL, nodeEnv: 'production' })
  )
  afterAll(() => mongoose.disconnect())

  beforeEach(async () => {
    await User.deleteMany()
    const newUser = new User({
      email: 'alice-user@example.com',
      emailVerificationToken: '123vtoken!',
      emailVerified: false,
      passwordResetExpires: Date.now(),
      passwordResetToken: '123ptoken!',
    })
    await newUser.setPassword('ABC123abc!')
    await newUser.save()
    user = await User.findOne({ email: 'alice-user@example.com' }).select(
      '+salt +hash'
    )
  })

  it('should have mongoose schema', () => {
    expect(user.email).toBe('alice-user@example.com')
    expect(user.emailVerificationToken).toBe('123vtoken!')
    expect(user.emailVerified).toBe(false)
    expect(user.passwordResetExpires.getTime()).toBeLessThanOrEqual(Date.now())
    expect(user.passwordResetToken).toBe('123ptoken!')
  })

  it('should use salt and hash for password', () => {
    expect(typeof user.salt).toBe('string')
    expect(user.salt.length).toBeTruthy()
    expect(typeof user.hash).toBe('string')
    expect(user.hash.length).toBeTruthy()
  })

  it('should have unique email field', async () => {
    expect.assertions(1)
    const anotherAlice = new User({ email: 'alice-user@example.com' })
    return expect(anotherAlice.save()).rejects.toThrow(/duplicate/)
  })

  it('should force lower-case for email field', async () => {
    expect.assertions(1)
    const anotherAlice = new User({ email: 'ALICE-USER@EXAMPLE.COM' })
    return expect(anotherAlice.save()).rejects.toThrow(/duplicate/)
  })

  it('should have emailVerified=false as default', async () => {
    await User({ email: 'bob-user@example.com' }).save()
    const bob = await User.findOne({ email: 'bob-user@example.com' })
    expect(bob.emailVerified).toBe(false)
  })

  it('should use passportLocalMongoose plugin', () => {
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
      const verifiedUser = new User({
        email: 'bob-user@example.com',
        emailVerified: true,
      })
      await verifiedUser.save()

      expect((await User.findByUsername('bob-user@example.com')).email).toBe(
        'bob-user@example.com'
      )
      expect(await User.findByUsername('alice-user@example.com')).toBeNull()
    })

    test('generateToken', () => {
      expect(User.generateToken()).toMatch(new RegExp(tokenRegexp))
    })
  })
})
