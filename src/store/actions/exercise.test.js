import { exerciseCompleted } from './exercise'

test('dispatch EXERCISE_COMPLETED', () => {
  const data = [
    {
      id: 'xyz',
      solved: true,
      solution: 'a',
      inputValue: 'a',
    },
  ]

  expect(exerciseCompleted(data)).toEqual({
    type: 'EXERCISE_COMPLETED',
    data,
  })
})
