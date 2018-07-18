import {
  exerciseInputChanged,
  exerciseToggleSolved,
} from './exercises'

it('should dispatch EXERCISE_INPUT_CHANGED action', () => {
  const data = [
    {
      uuid: 'xyz',
      solved: true,
      solution: 'a',
      validator: () => true,
      inputValue: 'a',
    },
  ]
  expect(exerciseInputChanged(data)).toEqual({
    type: 'EXERCISE_INPUT_CHANGED',
    data,
  })
})

it('should dispatch EXERCISE_TOGGLE_SOLVED action', () => {
  const data = [
    {
      uuid: 'xyz',
      solved: true,
    },
  ]
  expect(exerciseToggleSolved(data)).toEqual({
    type: 'EXERCISE_TOGGLE_SOLVED',
    data,
  })
})
