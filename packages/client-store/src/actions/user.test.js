import {
  editUser,
  editUserFailure,
  editUserSuccess,
  loginUser,
  loginUserFailure,
  loginUserSuccess,
  logoutUser,
  logoutUserFailure,
  logoutUserSuccess,
  registerUser,
  registerUserFailure,
  registerUserSuccess,
} from './user'

test('EDIT_USER action', () =>
  expect(editUser('alice@example.com', 's3cr3t')).toEqual({
    type: 'EDIT_USER',
    email: 'alice@example.com',
    password: 's3cr3t',
  }))

test('EDIT_USER_FAILURE action', () => {
  const error = new Error()
  expect(editUserFailure('alice@example.com', error)).toEqual({
    type: 'EDIT_USER_FAILURE',
    email: 'alice@example.com',
    error,
  })
})

test('EDIT_USER_SUCCESS action', () =>
  expect(editUserSuccess('alice@example.com')).toEqual({
    type: 'EDIT_USER_SUCCESS',
    email: 'alice@example.com',
  }))

test('LOGIN_USER action', () =>
  expect(loginUser('alice@example.com', 's3cr3t')).toEqual({
    type: 'LOGIN_USER',
    email: 'alice@example.com',
    password: 's3cr3t',
  }))

test('LOGIN_USER_FAILURE action', () => {
  const error = new Error()
  expect(loginUserFailure('alice@example.com', error)).toEqual({
    type: 'LOGIN_USER_FAILURE',
    email: 'alice@example.com',
    error,
  })
})

test('LOGIN_USER_SUCCESS action', () =>
  expect(loginUserSuccess('alice@example.com')).toEqual({
    type: 'LOGIN_USER_SUCCESS',
    email: 'alice@example.com',
  }))

test('LOGOUT_USER action', () =>
  expect(logoutUser('alice@example.com', 's3cr3t')).toEqual({
    type: 'LOGOUT_USER',
    email: 'alice@example.com',
    password: 's3cr3t',
  }))

test('LOGOUT_USER_FAILURE action', () => {
  const error = new Error()
  expect(logoutUserFailure('alice@example.com', error)).toEqual({
    type: 'LOGOUT_USER_FAILURE',
    email: 'alice@example.com',
    error,
  })
})

test('LOGOUT_USER_SUCCESS action', () =>
  expect(logoutUserSuccess('alice@example.com')).toEqual({
    type: 'LOGOUT_USER_SUCCESS',
    email: 'alice@example.com',
  }))

test('REGISTER_USER action', () =>
  expect(registerUser('alice@example.com', 's3cr3t')).toEqual({
    type: 'REGISTER_USER',
    email: 'alice@example.com',
    password: 's3cr3t',
  }))

test('REGISTER_USER_FAILURE action', () => {
  const error = new Error()
  expect(registerUserFailure('alice@example.com', error)).toEqual({
    type: 'REGISTER_USER_FAILURE',
    email: 'alice@example.com',
    error,
  })
})

test('REGISTER_USER_SUCCESS action', () =>
  expect(registerUserSuccess('alice@example.com')).toEqual({
    type: 'REGISTER_USER_SUCCESS',
    email: 'alice@example.com',
  }))
