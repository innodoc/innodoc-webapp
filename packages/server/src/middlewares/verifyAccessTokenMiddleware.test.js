import jwt from 'jsonwebtoken'

import verifyAccessTokenMiddleware from './verifyAccessTokenMiddleware'

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}))

const config = {
  appRoot: 'https://app.example.com/',
  jwtSecret: 'jwt123Secret',
}

describe('passConfigMiddleware', () => {
  const middleware = verifyAccessTokenMiddleware(config)
  const nextHandler = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should extract and verify accessToken from cookies', () => {
    const req = { cookies: { accessToken: '123!ToKeN!' } }
    const res = { locals: {} }
    jwt.verify.mockReturnValue({ sub: 'alice@example.com' })
    middleware(req, res, nextHandler)
    expect(jwt.verify).toBeCalledWith('123!ToKeN!', 'jwt123Secret', {
      issuer: 'https://app.example.com/',
    })
    expect(res.locals.loggedInEmail).toBe('alice@example.com')
    expect(nextHandler).toHaveBeenCalledTimes(1)
  })

  it('should do nothing w/o accessToken cookie', () => {
    const req = { cookies: {} }
    const res = { locals: {} }
    middleware(req, res, nextHandler)
    expect(jwt.verify).not.toBeCalled()
    expect(res.locals).not.toHaveProperty('loggedInEmail')
    expect(nextHandler).toHaveBeenCalledTimes(1)
  })

  it('should do nothing with failed verification', () => {
    const req = { cookies: { accessToken: 'b0rken!ToKeN!' } }
    const res = { locals: {} }
    jwt.verify.mockImplementation(() => {
      throw new Error()
    })
    middleware(req, res, nextHandler)
    expect(jwt.verify).toBeCalledWith('b0rken!ToKeN!', 'jwt123Secret', {
      issuer: 'https://app.example.com/',
    })
    expect(res.locals).not.toHaveProperty('loggedInEmail')
    expect(nextHandler).toHaveBeenCalledTimes(1)
  })
})
