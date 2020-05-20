import makeActions from './makeActions'

export const actionTypes = makeActions([
  'ADD_QUESTION',
  'QUESTION_ANSWERED',
  'QUESTION_SOLVED',
])

export const addQuestion = (exerciseId, questionId, points) => ({
  type: actionTypes.ADD_QUESTION,
  exerciseId,
  questionId,
  points,
})

export const questionAnswered = (id, answer, attributes) => ({
  type: actionTypes.QUESTION_ANSWERED,
  id,
  answer,
  attributes,
})

export const questionSolved = (id, correct) => ({
  type: actionTypes.QUESTION_SOLVED,
  id,
  correct,
})
