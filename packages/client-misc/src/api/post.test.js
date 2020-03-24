import {
  changePassword,
  checkEmail,
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  requestVerification,
  resetPassword,
  verifyUser,
} from './post'

const fetchOrig = global.fetch

afterEach(() => {
  global.fetch = fetchOrig
})

const base = 'https://app.example.com/'
const csrfToken = '123csrfToken!'

describe('postJson', () => {
  const makeTests = (name, getPromise, postData, apiUrl) => {
    describe(name, () => {
      it('should post', async () => {
        expect.assertions(2)
        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue({ result: 'ok' }),
        })
        await expect(getPromise()).resolves.toEqual({ result: 'ok' })
        expect(global.fetch.mock.calls[0]).toEqual([
          apiUrl,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'CSRF-Token': csrfToken,
            },
            body: JSON.stringify(postData),
          },
        ])
      })

      it('should fail if response not ok', async () => {
        expect.assertions(1)
        global.fetch = jest.fn().mockResolvedValue({
          ok: false,
          status: 500,
        })
        await expect(getPromise()).rejects.toEqual(new Error(500))
      })

      it('should fail if fetch promise rejects', async () => {
        expect.assertions(1)
        const error = new Error('Mock error')
        global.fetch = jest.fn().mockRejectedValue(error)
        await expect(getPromise()).rejects.toEqual(error)
      })
    })
  }

  makeTests(
    'changePassword',
    () =>
      changePassword(base, csrfToken, 'foo@example.com', '53cr3t', 'oldpwd'),
    { email: 'foo@example.com', password: '53cr3t', oldPassword: 'oldpwd' },
    'https://app.example.com/user/change-password'
  )

  makeTests(
    'checkEmail',
    () => checkEmail(base, csrfToken, 'foo@example.com'),
    { email: 'foo@example.com' },
    'https://app.example.com/user/check-email'
  )

  makeTests(
    'loginUser',
    () => loginUser(base, csrfToken, 'foo@example.com', '53cr3t'),
    { email: 'foo@example.com', password: '53cr3t' },
    'https://app.example.com/user/login'
  )

  makeTests(
    'logoutUser',
    () => logoutUser(base, csrfToken),
    {},
    'https://app.example.com/user/logout'
  )

  makeTests(
    'logoutUser',
    () => logoutUser(base, csrfToken),
    {},
    'https://app.example.com/user/logout'
  )

  makeTests(
    'registerUser',
    () => registerUser(base, csrfToken, 'foo@example.com', '53cr3t'),
    { email: 'foo@example.com', password: '53cr3t' },
    'https://app.example.com/user/register'
  )

  makeTests(
    'requestPasswordReset',
    () => requestPasswordReset(base, csrfToken, 'foo@example.com'),
    { email: 'foo@example.com' },
    'https://app.example.com/user/request-password-reset'
  )

  makeTests(
    'requestVerification',
    () => requestVerification(base, csrfToken, 'foo@example.com'),
    { email: 'foo@example.com' },
    'https://app.example.com/user/request-verification'
  )

  makeTests(
    'resetPassword',
    () => resetPassword(base, csrfToken, 's3cr3t', '123pwdResetToken!'),
    { password: 's3cr3t', token: '123pwdResetToken!' },
    'https://app.example.com/user/reset-password'
  )

  makeTests(
    'verifyUser',
    () => verifyUser(base, csrfToken, '123verifyToken!'),
    { token: '123verifyToken!' },
    'https://app.example.com/user/verify'
  )
})
