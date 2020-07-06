import { makeSymbolObj } from '@innodoc/client-misc/src/util'

export const actionTypes = makeSymbolObj([
  'CLEAR_PROGRESS',
  'LOAD_PROGRESS',
  'USER_LOGGED_IN',
  'USER_LOGGED_OUT',
])

export const clearProgress = () => ({
  type: actionTypes.CLEAR_PROGRESS,
})

export const loadProgress = (answeredQuestions, visitedSections) => ({
  type: actionTypes.LOAD_PROGRESS,
  answeredQuestions,
  visitedSections,
})

export const userLoggedIn = (email) => ({
  type: actionTypes.USER_LOGGED_IN,
  email,
})

export const userLoggedOut = () => ({
  type: actionTypes.USER_LOGGED_OUT,
})
