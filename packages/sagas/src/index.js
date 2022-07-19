import { HYDRATE } from 'next-redux-wrapper'
import { all, takeEvery } from 'redux-saga/effects'

import contentSagas from './content'
import hydrateSaga from './hydrateSaga'
import progressSagas from './progress'
import questionSagas from './question'
import uiSagas from './ui'

export default function* rootSaga() {
  yield all([
    takeEvery(HYDRATE, hydrateSaga),
    ...contentSagas,
    ...progressSagas,
    ...questionSagas,
    ...uiSagas,
  ])
}
