import { makeSymbolObj } from '@innodoc/client-misc/src/util'

export const actionTypes = makeSymbolObj([
  'ADD_QUESTION',
  'QUESTION_ANSWERED',
  'QUESTION_EVALUATED',
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
