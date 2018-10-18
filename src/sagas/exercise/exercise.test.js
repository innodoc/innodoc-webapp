import {
  call,
  put,
  take,
  fork,
} from 'redux-saga/effects'

import watchExerciseChange, { handleExerciseCompleted } from './exercise'
import { exerciseCompleted, actionTypes as exerciseActionTypes } from '../../store/actions/exercise'
import validators from '../../lib/validators'

const wrongAnswer = exerciseCompleted({
  attrs: { questionType: 'exact' },
  id: 'testExercise',
  inputValue: 'tes',
  solved: false,
  solution: 'test',
})
const correctAnswer = exerciseCompleted({
  attrs: { questionType: 'exact' },
  id: 'testExercise',
  inputValue: 'test',
  solved: false,
  solution: 'test',
})

describe('exerciseCompleted', () => {
  test('wrong input', () => {
    const gen = handleExerciseCompleted(wrongAnswer)
    expect(gen.next().value).toEqual(call(
      validators[wrongAnswer.data.attrs.questionType],
      wrongAnswer.data.inputValue,
      wrongAnswer.data.solution,
      wrongAnswer.data.attrs))
    expect(gen.next(false).done).toEqual(true)
  })

  test('right input', () => {
    const gen = handleExerciseCompleted(correctAnswer)
    expect(gen.next().value).toEqual(call(
      validators[correctAnswer.data.attrs.questionType],
      correctAnswer.data.inputValue,
      correctAnswer.data.solution,
      correctAnswer.data.attrs))
    expect(gen.next().value).toEqual(put(exerciseCompleted({
      solved: true,
      ...correctAnswer.data,
    })))
    expect(gen.next().done).toEqual(true)
  })
})

describe('watchExerciseChange', () => {
  test('exercise input change', () => {
    const gen = watchExerciseChange()
    expect(gen.next().value).toEqual(take(exerciseActionTypes.EXERCISE_COMPLETED))
    expect(gen.next(wrongAnswer).value)
      .toEqual(fork(handleExerciseCompleted, wrongAnswer))
  })
})
