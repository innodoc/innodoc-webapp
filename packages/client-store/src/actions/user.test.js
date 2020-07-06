import { loadProgress, userLoggedIn, userLoggedOut } from './user'

test('LOAD_PROGRESS action', () =>
  expect(loadProgress(['foo'], ['bar'])).toEqual({
    type: 'LOAD_PROGRESS',
    answeredQuestions: ['foo'],
    visitedSections: ['bar'],
  }))

test('USER_LOGGED_IN action', () =>
  expect(userLoggedIn('alice@example.com')).toEqual({
    type: 'USER_LOGGED_IN',
    email: 'alice@example.com',
  }))

test('USER_LOGGED_OUT action', () =>
  expect(userLoggedOut()).toEqual({
    type: 'USER_LOGGED_OUT',
  }))
