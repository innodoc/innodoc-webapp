import { actionTypes, questionAnswered, questionSolved } from './question'

test('dispatch QUESTION_ANSWERED', () => {
  const data = { foo: 'bar' }
  expect(questionAnswered(data)).toEqual({
    type: actionTypes.QUESTION_ANSWERED,
    data,
  })
})

test('dispatch QUESTION_SOLVED', () => {
  const data = { foo: 'bar' }
  expect(questionSolved(data)).toEqual({
    type: actionTypes.QUESTION_SOLVED,
    data,
  })
})
