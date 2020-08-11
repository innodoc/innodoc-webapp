import { call, debounce, put } from 'redux-saga/effects'

import validators from '@innodoc/client-question-validators'
import { actionTypes, questionEvaluated } from '@innodoc/client-store/src/actions/question'

export const QUESTION_ANSWER_DEBOUNCE_TIME = 500

export function* handleQuestionAnsweredSaga({ id, answer, attributes }) {
  const { solution, validation, ...remainingAttrs } = attributes
  const validator = validators[validation]

  if (typeof validator === 'function') {
    const [result, messages, latexCode] = yield call(validator, answer, solution, remainingAttrs)
    yield put(questionEvaluated(id, result, messages, latexCode))
  }
}

export default function* watchQuestionChangeSaga() {
  yield debounce(
    QUESTION_ANSWER_DEBOUNCE_TIME,
    actionTypes.QUESTION_ANSWERED,
    handleQuestionAnsweredSaga
  )
}
