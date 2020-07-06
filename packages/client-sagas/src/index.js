import { all } from 'redux-saga/effects'

import contentSagas from './content'
import i18nSagas from './i18n'
import progressSagas from './progress'
import questionSagas from './question'
import uiSagas from './ui'

export default function* rootSaga() {
  yield all([...contentSagas, ...i18nSagas, ...progressSagas, ...questionSagas, ...uiSagas])
}
