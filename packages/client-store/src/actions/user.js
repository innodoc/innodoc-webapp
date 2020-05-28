import { makeSymbolObj } from '@innodoc/client-misc/src/util'

export const actionTypes = makeSymbolObj(['USER_LOGGED_IN', 'USER_LOGGED_OUT'])

export const userLoggedIn = (email) => ({
  type: actionTypes.USER_LOGGED_IN,
  email,
})

export const userLoggedOut = () => ({
  type: actionTypes.USER_LOGGED_OUT,
})
