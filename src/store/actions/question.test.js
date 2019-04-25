import { questionAnswered } from './question'

test('dispatch QUESTION_ANSWERED', () => {
  const data = [
    {
      id: 'xyz',
      solved: true,
      solution: 'a',
      inputValue: 'a',
    },
  ]

  expect(questionAnswered(data)).toEqual({
    type: 'QUESTION_ANSWERED',
    data,
  })
})
