import { makeSymbolObj } from '@innodoc/misc/utils'

export const actionTypes = makeSymbolObj([
  'CLEAR_PROGRESS',
  'LOAD_PROGRESS',
  'RESET_TEST',
  'SUBMIT_TEST',
  'TEST_SCORE',
  'USER_LOGGED_IN',
  'USER_LOGGED_OUT',
])

export const clearProgress = () => ({
  type: actionTypes.CLEAR_PROGRESS,
})

export const loadProgress = (answeredQuestions, visitedSections, testScores) => ({
  type: actionTypes.LOAD_PROGRESS,
  answeredQuestions,
  visitedSections,
  testScores,
})

export const resetTest = (sectionId) => ({
  type: actionTypes.RESET_TEST,
  sectionId,
})

export const submitTest = (sectionId) => ({
  type: actionTypes.SUBMIT_TEST,
  sectionId,
})

export const testScore = (sectionId, score) => ({
  type: actionTypes.TEST_SCORE,
  sectionId,
  score,
})

export const userLoggedIn = (email) => ({
  type: actionTypes.USER_LOGGED_IN,
  email,
})

export const userLoggedOut = () => ({
  type: actionTypes.USER_LOGGED_OUT,
})
