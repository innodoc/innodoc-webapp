import {
  clearProgress,
  loadProgress,
  resetTest,
  submitTest,
  testScore,
  userLoggedIn,
  userLoggedOut,
} from './user'

test('CLEAR_PROGRESS action', () =>
  expect(clearProgress()).toEqual({
    type: 'CLEAR_PROGRESS',
  }))

test('LOAD_PROGRESS action', () =>
  expect(loadProgress(['foo'], ['bar'])).toEqual({
    type: 'LOAD_PROGRESS',
    answeredQuestions: ['foo'],
    visitedSections: ['bar'],
  }))

test('RESET_TEST action', () =>
  expect(resetTest('foo/bar')).toEqual({
    type: 'RESET_TEST',
    sectionId: 'foo/bar',
  }))

test('SUBMIT_TEST action', () =>
  expect(submitTest('foo/bar')).toEqual({
    type: 'SUBMIT_TEST',
    sectionId: 'foo/bar',
  }))

test('TEST_SCORE action', () =>
  expect(testScore('foo/bar', 42)).toEqual({
    type: 'TEST_SCORE',
    sectionId: 'foo/bar',
    score: 42,
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
