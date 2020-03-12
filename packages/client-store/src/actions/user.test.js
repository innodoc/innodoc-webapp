import { userLoggedIn, userLoggedOut } from './user'

test('USER_LOGGED_IN action', () =>
  expect(userLoggedIn('alice@example.com')).toEqual({
    type: 'USER_LOGGED_IN',
    email: 'alice@example.com',
  }))

test('USER_LOGGED_OUT action', () =>
  expect(userLoggedOut()).toEqual({
    type: 'USER_LOGGED_OUT',
  }))
