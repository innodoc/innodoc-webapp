import { exerciseCompleted } from './exercises'

test('dispatch EXERCISE_INPUT_COMPLETED', () => {
  const data = [
    {
      id: 'xyz',
      solved: true,
      solution: 'a',
      inputValue: 'a',
    },
  ]

  expect(exerciseCompleted(data)).toEqual({
    type: 'EXERCISE_INPUT_COMPLETED',
    data,
  })
})
