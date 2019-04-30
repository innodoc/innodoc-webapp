import { call, put, throttle } from 'redux-saga/effects'

import { actionTypes as questionActionTypes, questionSolved } from '../../store/actions/question'
import checkers from '../../lib/questionCheckers'

export const QUESTION_ANSWER_THROTTLE = 500

export function* handleQuestionAnswered({ data }) {
  const { questionId, attributes, answer } = data
  const { questionType, solution, ...remainingAttrs } = attributes
  const checker = checkers[questionType]
  if (checker) {
    const correct = yield call(checker, answer, solution, remainingAttrs)
    yield put(questionSolved({ questionId, answer, correct }))
  }
}

export default function* watchQuestionChange() {
  yield throttle(
    QUESTION_ANSWER_THROTTLE, questionActionTypes.QUESTION_ANSWERED, handleQuestionAnswered
  )
}
