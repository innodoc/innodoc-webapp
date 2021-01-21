import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

import {
  actionTypes,
  addQuestion,
  questionAnswered,
  questionEvaluated,
  questionInvalid,
} from './question'

test('ADD_QUESTION', () =>
  expect(addQuestion('EX_01', 'Q_01', 17)).toEqual({
    type: actionTypes.ADD_QUESTION,
    exerciseId: 'EX_01',
    questionId: 'Q_01',
    points: 17,
  }))

test('QUESTION_ANSWERED', () =>
  expect(questionAnswered('Q_01', 'Foo', { precision: 5 })).toEqual({
    type: actionTypes.QUESTION_ANSWERED,
    id: 'Q_01',
    answer: 'Foo',
    attributes: { precision: 5 },
  }))

test('QUESTION_EVALUATED', () =>
  expect(questionEvaluated('Q_01', RESULT_VALUE.CORRECT, ['foo'], 'x^2')).toEqual({
    type: actionTypes.QUESTION_EVALUATED,
    id: 'Q_01',
    latexCode: 'x^2',
    messages: ['foo'],
    result: RESULT_VALUE.CORRECT,
  }))

test('QUESTION_INVALID', () =>
  expect(questionInvalid('Q_01', 'Error message')).toEqual({
    type: actionTypes.QUESTION_INVALID,
    id: 'Q_01',
    message: 'Error message',
  }))
