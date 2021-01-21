import { expectSaga } from 'redux-saga-test-plan'

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'
import validators from '@innodoc/client-question-validators'
import {
  actionTypes as questionActionTypes,
  questionEvaluated,
  questionInvalid,
} from '@innodoc/client-store/src/actions/question'

import handleQuestionAnsweredSaga from './handleQuestionAnsweredSaga'

const mockExactRet = [RESULT_VALUE.INCORRECT, ['foo'], '41']
jest.mock('@innodoc/client-question-validators', () => ({
  exact: () => mockExactRet,
  throwing: () => {
    throw new Error('Some validation error')
  },
}))

describe('handleQuestionAnsweredSaga', () => {
  it('should call validator and put questionEvaluated', () => {
    const data = {
      id: 'foo/bar#Q1',
      answer: '41',
      attributes: {
        validation: 'exact',
        solution: '42',
      },
    }
    return expectSaga(handleQuestionAnsweredSaga, data)
      .call.like({ fn: validators.exact })
      .put(questionEvaluated('foo/bar#Q1', RESULT_VALUE.INCORRECT, ['foo'], '41'))
      .run()
  })

  it('should not put questionEvaluated with unknown validator', () => {
    const data = {
      id: 'foo/bar#Q1',
      answer: '41',
      attributes: {
        validation: 'validator-does-not-exist',
        solution: '42',
      },
    }
    return expectSaga(handleQuestionAnsweredSaga, data)
      .not.put.actionType(questionActionTypes.QUESTION_EVALUATED)
      .run()
  })

  it('should put questionInvalid with erroneous validator', () => {
    const data = {
      id: 'foo/bar#Q1',
      answer: '41',
      attributes: {
        validation: 'throwing',
        solution: '42',
      },
    }
    return expectSaga(handleQuestionAnsweredSaga, data)
      .not.put.actionType(questionActionTypes.QUESTION_EVALUATED)
      .put(questionInvalid('foo/bar#Q1', 'Invalid question: Some validation error'))
      .run()
  })
})
