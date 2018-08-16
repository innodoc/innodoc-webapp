import { all } from 'redux-saga/effects'

import i18nSagas from './i18n'
import contentSagas from './content'
import exerciseSagas from './exercise'

export default function* rootSaga() {
  yield all([
    ...i18nSagas,
    ...contentSagas,
    ...exerciseSagas,
  ])
}
