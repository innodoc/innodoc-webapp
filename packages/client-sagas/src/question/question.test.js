import { expectSaga, testSaga } from 'redux-saga-test-plan'

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'
import validators from '@innodoc/client-question-validators'
import {
  actionTypes as questionActionTypes,
  questionEvaluated,
} from '@innodoc/client-store/src/actions/question'

import watchQuestionChange, {
  handleQuestionAnswered,
  QUESTION_ANSWER_THROTTLE,
} from './question'

const mockExactRet = [RESULT_VALUE.INCORRECT, ['foo'], '41']
jest.mock('@innodoc/client-question-validators', () => ({
  exact: () => mockExactRet,
}))

describe('handleQuestionAnswered', () => {
  it('should call validator and put questionEvaluated', () => {
    const data = {
      id: 'foo/bar#Q1',
      answer: '41',
      attributes: {
        validation: 'exact',
        solution: '42',
      },
    }
    return expectSaga(handleQuestionAnswered, data)
      .call.like({ fn: validators.exact })
      .put(
        questionEvaluated('foo/bar#Q1', RESULT_VALUE.INCORRECT, ['foo'], '41')
      )
      .run()
  })

  it('should not put questionEvaluated with unknown validator', () => {
    const data = {
      questionId: 'foo/bar#Q1',
      answer: '41',
      attributes: {
        validation: 'validator-does-not-exist',
        solution: '42',
      },
    }
    return expectSaga(handleQuestionAnswered, data)
      .not.put.actionType(questionActionTypes.QUESTION_EVALUATED)
      .run()
  })
})

describe('watchQuestionChange', () => {
  it('should throttle handleQuestionAnswered saga on QUESTION_ANSWERED', () => {
    testSaga(watchQuestionChange)
      .next()
      .throttle(
        QUESTION_ANSWER_THROTTLE,
        questionActionTypes.QUESTION_ANSWERED,
        handleQuestionAnswered
      )
      .next()
      .isDone()
  })
})
