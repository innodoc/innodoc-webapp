import { expectSaga, testSaga } from 'redux-saga-test-plan'

import {
  actionTypes as questionActionTypes,
  questionSolved,
} from '@innodoc/client-store/src/actions/question'
import checkers from '@innodoc/client-misc/src/questionCheckers'

import watchQuestionChange, {
  handleQuestionAnswered,
  QUESTION_ANSWER_THROTTLE,
} from './question'

describe('handleQuestionAnswered', () => {
  it('should call the checker and put questionSolved', () => {
    const data = {
      questionId: 'foo/bar#Q1',
      answer: '41',
      attributes: {
        questionType: 'exact',
        solution: '42',
      },
    }
    return expectSaga(handleQuestionAnswered, { data })
      .call.like({ fn: checkers.exact })
      .put(
        questionSolved({
          questionId: 'foo/bar#Q1',
          answer: '41',
          correct: false,
        })
      )
      .run()
  })

  it('should not put questionSolved with unknown checker', () => {
    const data = {
      questionId: 'foo/bar#Q1',
      answer: '41',
      attributes: {
        questionType: 'this-checker-does-not-exist',
        solution: '42',
      },
    }
    return expectSaga(handleQuestionAnswered, { data })
      .not.put.actionType(questionActionTypes.QUESTION_SOLVED)
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
