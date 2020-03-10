import makeActions from './makeActions'

export const actionTypes = makeActions(['QUESTION_ANSWERED', 'QUESTION_SOLVED'])

export const questionAnswered = (data) => ({
  data,
  type: actionTypes.QUESTION_ANSWERED,
})

export const questionSolved = (data) => ({
  data,
  type: actionTypes.QUESTION_SOLVED,
})
