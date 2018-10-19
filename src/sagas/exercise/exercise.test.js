import {
  call,
  put,
  take,
  fork,
} from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import watchExerciseChange, { exerciseInputChanged } from './exercises'
import { exerciseInputCompleted, actionTypes as exerciseActionTypes } from '../../store/actions/exercises'
import validators from '../../lib/validators'

const payload = {
  attrs: { questionType: 'exact' },
  id: 'testExercise',
  inputValue: 'tes',
  solved: false,
  solution: 'test',
}

describe('exerciseInputChanged', () => {
  const gen = cloneableGenerator(exerciseInputChanged)(payload)

  test('wrong input', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(call(
      validators[payload.attrs.questionType],
      payload.inputValue,
      payload.solution,
      payload.attrs))
    expect(clone.next().done).toEqual(true)
  })

  payload.inputValue = 'test'
  test('right input', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(call(
      validators[payload.attrs.questionType],
      payload.inputValue,
      payload.solution,
      payload.attrs))
    expect(clone.next().value).toEqual(put(exerciseInputCompleted({
      id: payload.id,
      inputValue: payload.inputValue,
      solved: true,
    })))
    expect(clone.next().done).toEqual(true)
  })
})

describe('watchExerciseChange', () => {
  const gen = cloneableGenerator(watchExerciseChange)()

  test('exercise input change', () => {
    const clone = gen.clone()
    expect(clone.next().value).toEqual(take(exerciseActionTypes.EXERCISE_INPUT_COMPLETED))
    expect(clone.next().value).toEqual(fork(exerciseInputChanged, payload))
    expect(clone.done).toEqual(true)
  })
})
