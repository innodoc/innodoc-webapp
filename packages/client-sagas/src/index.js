import { all } from 'redux-saga/effects'

import contentSagas from './content'
import i18nSagas from './i18n'
import questionSagas from './question'
import uiSagas from './ui'

export default function* rootSaga() {
  yield all([...contentSagas, ...i18nSagas, ...questionSagas, ...uiSagas])
}
