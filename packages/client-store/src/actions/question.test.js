import { actionTypes, questionAnswered, questionSolved } from './question'

test('QUESTION_ANSWERED', () => {
  const data = { foo: 'bar' }
  expect(questionAnswered(data)).toEqual({
    type: actionTypes.QUESTION_ANSWERED,
    data,
  })
})

test('QUESTION_SOLVED', () => {
  const data = { foo: 'bar' }
  expect(questionSolved(data)).toEqual({
    type: actionTypes.QUESTION_SOLVED,
    data,
  })
})
