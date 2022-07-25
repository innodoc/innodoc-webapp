import { call, put } from 'redux-saga/effects'

import validators from '@innodoc/question-validators'
import { questionEvaluated, questionInvalid } from '@innodoc/store/actions/question'

export default function* handleQuestionAnsweredSaga({ id, answer, attributes }) {
  const { solution, validation, ...remainingAttrs } = attributes
  const validator = validators[validation]

  let result
  let messages
  let latexCode
  if (typeof validator === 'function') {
    try {
      ;[result, messages, latexCode] = yield call(validator, answer, solution, remainingAttrs)
    } catch (e) {
      yield put(questionInvalid(id, `Invalid question: ${e.message}`))
      return
    }
    yield put(questionEvaluated(id, result, messages, latexCode))
  }
}
