import { call, put, throttle } from 'redux-saga/effects'

import { actionTypes as questionActionTypes, questionSolved } from '../../store/actions/question'
import checkers from '../../lib/questionCheckers'

export function* handleQuestionAnswered({ data }) {
  const { questionId, attributes, answer } = data
  const { validation, solution } = attributes
  const checker = checkers[validation]
  if (checker) {
    const correct = yield call(checker, answer, solution, attributes)
    yield put(questionSolved({ questionId, answer, correct }))
  }
}

export default function* watchQuestionChange() {
  yield throttle(500, questionActionTypes.QUESTION_ANSWERED, handleQuestionAnswered)
}
