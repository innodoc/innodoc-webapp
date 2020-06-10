import { call, put, throttle } from 'redux-saga/effects'

import validators from '@innodoc/client-question-validators'
import {
  actionTypes,
  questionEvaluated,
} from '@innodoc/client-store/src/actions/question'

export const QUESTION_ANSWER_THROTTLE = 500

export function* handleQuestionAnswered({ id, answer, attributes }) {
  const { solution, validation, ...remainingAttrs } = attributes
  const validator = validators[validation]

  if (typeof validator === 'function') {
    const [result, messages, latexCode] = yield call(
      validator,
      answer,
      solution,
      remainingAttrs
    )
    yield put(questionEvaluated(id, result, messages, latexCode))
  }
}

export default function* watchQuestionChange() {
  yield throttle(
    QUESTION_ANSWER_THROTTLE,
    actionTypes.QUESTION_ANSWERED,
    handleQuestionAnswered
  )
}
