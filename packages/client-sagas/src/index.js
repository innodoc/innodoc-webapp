import { all } from 'redux-saga/effects'

import i18nSagas from './i18n'
import contentSagas from './content'
import questionSagas from './question'
import userSagas from './user'

export default function* rootSaga() {
  yield all([...i18nSagas, ...contentSagas, ...questionSagas, ...userSagas])
}
