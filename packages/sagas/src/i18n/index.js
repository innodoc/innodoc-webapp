// TODO: remove whole module as language is now handled with next/router

import { fork, takeLatest } from 'redux-saga/effects'

import { actionTypes } from '@innodoc/store/src/actions/i18n'
import { notifyI18nextSaga, waitForI18NextSaga } from './i18n'

export default [
  fork(waitForI18NextSaga),
  // takeLatest(actionTypes.CHANGE_LANGUAGE, notifyI18nextSaga),
]
