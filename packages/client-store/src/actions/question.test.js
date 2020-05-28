import { actionTypes, questionAnswered, questionEvaluated } from './question'

test('QUESTION_ANSWERED', () => {
  const data = { foo: 'bar' }
  expect(questionAnswered(data)).toEqual({
    type: actionTypes.QUESTION_ANSWERED,
    data,
  })
})

test('QUESTION_EVALUATED', () => {
  const data = { foo: 'bar' }
  expect(questionEvaluated(data)).toEqual({
    type: actionTypes.QUESTION_EVALUATED,
    data,
  })
})
