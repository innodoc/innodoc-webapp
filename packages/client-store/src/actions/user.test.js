import { loginUser, logoutUser } from './user'

test('LOGIN_USER action', () =>
  expect(loginUser('alice@example.com', 's3cr3t')).toEqual({
    type: 'LOGIN_USER',
    email: 'alice@example.com',
    password: 's3cr3t',
  }))

test('LOGOUT_USER action', () =>
  expect(logoutUser('alice@example.com', 's3cr3t')).toEqual({
    type: 'LOGOUT_USER',
    email: 'alice@example.com',
    password: 's3cr3t',
  }))
