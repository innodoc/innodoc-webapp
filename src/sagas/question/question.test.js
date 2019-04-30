import {
  call,
  fork,
  put,
  take,
} from 'redux-saga/effects'

import watchQuestionChange, { handleQuestionAnswered } from './question'
import { actionTypes as questionActionTypes, questionAnswered } from '../../store/actions/question'
import checkers from '../../lib/questionCheckers'

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

describe('handleQuestionAnswered', () => {
  test('wrong input', () => {
    const gen = handleQuestionAnswered(wrongAnswer)
    expect(gen.next().value).toEqual(call(
      checkers[wrongAnswer.data.attrs.questionType],
      wrongAnswer.data.inputValue,
      wrongAnswer.data.solution,
      wrongAnswer.data.attrs))
    expect(gen.next(false).done).toEqual(true)
  })

  test('right input', () => {
    const gen = handleQuestionAnswered(correctAnswer)
    expect(gen.next().value).toEqual(call(
      checkers[correctAnswer.data.attrs.questionType],
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

describe('watchQuestionChange', () => {
  test('exercise input change', () => {
    const gen = watchQuestionChange()
    expect(gen.next().value).toEqual(take(questionActionTypes.QUESTION_ANSWERED))
    expect(gen.next(wrongAnswer).value)
      .toEqual(fork(handleQuestionAnswered, wrongAnswer))
  })
})
