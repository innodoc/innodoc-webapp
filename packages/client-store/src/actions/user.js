import makeActions from './makeActions'

export const actionTypes = makeActions([
  'EDIT_USER_FAILURE',
  'EDIT_USER_SUCCESS',
  'EDIT_USER',
  'LOGIN_USER_FAILURE',
  'LOGIN_USER_SUCCESS',
  'LOGIN_USER',
  'LOGOUT_USER_FAILURE',
  'LOGOUT_USER_SUCCESS',
  'LOGOUT_USER',
  'REGISTER_USER_FAILURE',
  'REGISTER_USER_SUCCESS',
  'REGISTER_USER',
])

export const editUser = (email, password) => ({
  type: actionTypes.EDIT_USER,
  email,
  password,
})

export const editUserFailure = (email, error) => ({
  type: actionTypes.EDIT_USER_FAILURE,
  email,
  error,
})

export const editUserSuccess = (email) => ({
  type: actionTypes.EDIT_USER_SUCCESS,
  email,
})

export const loginUser = (email, password) => ({
  type: actionTypes.LOGIN_USER,
  email,
  password,
})

export const loginUserFailure = (email, error) => ({
  type: actionTypes.LOGIN_USER_FAILURE,
  email,
  error,
})

export const loginUserSuccess = (email) => ({
  type: actionTypes.LOGIN_USER_SUCCESS,
  email,
})

export const logoutUser = (email, password) => ({
  type: actionTypes.LOGOUT_USER,
  email,
  password,
})

export const logoutUserFailure = (email, error) => ({
  type: actionTypes.LOGOUT_USER_FAILURE,
  email,
  error,
})

export const logoutUserSuccess = (email) => ({
  type: actionTypes.LOGOUT_USER_SUCCESS,
  email,
})

export const registerUser = (email, password) => ({
  type: actionTypes.REGISTER_USER,
  email,
  password,
})

export const registerUserFailure = (email, error) => ({
  type: actionTypes.REGISTER_USER_FAILURE,
  email,
  error,
})

export const registerUserSuccess = (email) => ({
  type: actionTypes.REGISTER_USER_SUCCESS,
  email,
})
