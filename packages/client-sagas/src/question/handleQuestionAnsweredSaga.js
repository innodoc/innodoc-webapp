import { call, put } from 'redux-saga/effects'

import validators from '@innodoc/client-question-validators'
import { questionEvaluated } from '@innodoc/client-store/src/actions/question'

export default function* handleQuestionAnsweredSaga({ id, answer, attributes }) {
  const { solution, validation, ...remainingAttrs } = attributes
  const validator = validators[validation]

  if (typeof validator === 'function') {
    const [result, messages, latexCode] = yield call(validator, answer, solution, remainingAttrs)
    yield put(questionEvaluated(id, result, messages, latexCode))
  }
}
