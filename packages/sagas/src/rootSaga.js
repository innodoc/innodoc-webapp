import { HYDRATE } from 'next-redux-wrapper'
import { all, takeEvery } from 'redux-saga/effects'

import contentSagas from './content/contentSagas.js'
import hydrateSaga from './hydrateSaga.js'
import progressSagas from './progress/progressSagas.js'
import questionSagas from './question/questionSagas.js'
import uiSagas from './ui/uiSagas.js'

export default function* rootSaga() {
  yield all([
    takeEvery(HYDRATE, hydrateSaga),
    ...contentSagas,
    ...progressSagas,
    ...questionSagas,
    ...uiSagas,
  ])
}
