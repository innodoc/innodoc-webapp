import jwt from 'jsonwebtoken'

import User from '../models/User'
import lookupUserMiddleware from './lookupUserMiddleware'

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}))

jest.mock('../models/User', () => ({
  findByUsername: jest.fn(),
}))

const config = {
  appRoot: 'https://app.example.com/',
  jwtSecret: 'jwt123Secret',
}

describe('lookupUserMiddleware', () => {
  const middleware = lookupUserMiddleware(config)
  const nextHandler = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should extract email and attach user to request', async () => {
    expect.assertions(4)
    const req = { cookies: { accessToken: '123!ToKeN!' } }
    jwt.verify.mockReturnValue({ sub: 'alice@example.com' })
    const user = { email: 'alice@example.com' }
    User.findByUsername.mockResolvedValue(user)
    await middleware(req, {}, nextHandler)
    expect(jwt.verify).toBeCalledWith('123!ToKeN!', 'jwt123Secret', {
      issuer: 'https://app.example.com/',
    })
    expect(req.user).toBe(user)
    expect(User.findByUsername).toBeCalledTimes(1)
    expect(nextHandler).toHaveBeenCalledTimes(1)
  })

  it('should not attach user to request w/o accessToken cookie', async () => {
    expect.assertions(4)
    const req = { cookies: {} }
    await middleware(req, {}, nextHandler)
    expect(jwt.verify).not.toBeCalled()
    expect(req).not.toHaveProperty('user')
    expect(User.findByUsername).not.toBeCalled()
    expect(nextHandler).toHaveBeenCalledTimes(1)
  })

  it('should not attach user to request with failed verification', async () => {
    expect.assertions(4)
    const req = { cookies: { accessToken: 'b0rken!ToKeN!' } }
    jwt.verify.mockImplementation(() => {
      throw new Error()
    })
    await middleware(req, {}, nextHandler)
    expect(jwt.verify).toBeCalledWith('b0rken!ToKeN!', 'jwt123Secret', {
      issuer: 'https://app.example.com/',
    })
    expect(req).not.toHaveProperty('user')
    expect(User.findByUsername).not.toBeCalled()
    expect(nextHandler).toHaveBeenCalledTimes(1)
  })

  it('should not attach user to request with non-existent user', async () => {
    expect.assertions(4)
    const req = { cookies: { accessToken: '123!ToKeN!' } }
    jwt.verify.mockReturnValue({ sub: 'alice@example.com' })
    User.findByUsername.mockResolvedValue(undefined)
    await middleware(req, {}, nextHandler)
    expect(jwt.verify).toBeCalledWith('123!ToKeN!', 'jwt123Secret', {
      issuer: 'https://app.example.com/',
    })
    expect(req).not.toHaveProperty('user')
    expect(User.findByUsername).toBeCalledTimes(1)
    expect(nextHandler).toHaveBeenCalledTimes(1)
  })
})
