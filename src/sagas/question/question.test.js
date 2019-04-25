import {
  call,
  fork,
  put,
  take,
} from 'redux-saga/effects'

import watchExerciseChange, { handleExerciseCompleted } from './exercise'
import { actionTypes as questionActionTypes, questionAnswered } from '../../store/actions/exercise'
import validators from '../../lib/validators'

const wrongAnswer = questionAnswered({
  attrs: { questionType: 'exact' },
  id: 'testExercise',
  inputValue: 'tes',
  solved: false,
  solution: 'test',
})
const correctAnswer = questionAnswered({
  attrs: { questionType: 'exact' },
  id: 'testExercise',
  inputValue: 'test',
  solved: false,
  solution: 'test',
})

describe('questionAnswered', () => {
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
    expect(gen.next().value).toEqual(put(questionAnswered({
      solved: true,
      ...correctAnswer.data,
    })))
    expect(gen.next().done).toEqual(true)
  })
})

describe('watchExerciseChange', () => {
  test('exercise input change', () => {
    const gen = watchExerciseChange()
    expect(gen.next().value).toEqual(take(questionActionTypes.QUESTION_ANSWERED))
    expect(gen.next(wrongAnswer).value)
      .toEqual(fork(handleExerciseCompleted, wrongAnswer))
  })
})
