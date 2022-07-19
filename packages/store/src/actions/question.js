import { util } from '@innodoc/misc'

export const actionTypes = util.makeSymbolObj([
  'ADD_QUESTION',
  'QUESTION_ANSWERED',
  'QUESTION_EVALUATED',
  'QUESTION_INVALID',
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

export const questionEvaluated = (id, result, messages, latexCode) => ({
  type: actionTypes.QUESTION_EVALUATED,
  id,
  latexCode,
  messages,
  result,
})

export const questionInvalid = (id, message) => ({
  type: actionTypes.QUESTION_INVALID,
  id,
  message,
})
