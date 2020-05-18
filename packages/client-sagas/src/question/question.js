import { call, put, throttle } from 'redux-saga/effects'

import checkers from '@innodoc/client-misc/src/questionCheckers'
import {
  actionTypes,
  questionSolved,
} from '@innodoc/client-store/src/actions/question'

export const QUESTION_ANSWER_THROTTLE = 500

export function* handleQuestionAnswered({ data }) {
  const { questionId, attributes, answer } = data
  const { solution, validation, ...remainingAttrs } = attributes
  const checker = checkers[validation]
  if (checker) {
    const correct = yield call(checker, answer, solution, remainingAttrs)
    yield put(questionSolved({ questionId, answer, correct }))
  }
}

export default function* watchQuestionChange() {
  yield throttle(
    QUESTION_ANSWER_THROTTLE,
    actionTypes.QUESTION_ANSWERED,
    handleQuestionAnswered
  )
}
