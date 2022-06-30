import { all } from 'redux-saga/effects'

import contentSagas from './content'
import progressSagas from './progress'
import questionSagas from './question'
import uiSagas from './ui'

export default function* rootSaga() {
  yield all([...contentSagas, ...progressSagas, ...questionSagas, ...uiSagas])
}
