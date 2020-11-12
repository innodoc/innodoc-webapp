import { actionTypes, resetExercise } from './exercise'

test('RESET_EXERCISE', () =>
  expect(resetExercise('EX_01')).toEqual({
    type: actionTypes.RESET_EXERCISE,
    id: 'EX_01',
  }))
