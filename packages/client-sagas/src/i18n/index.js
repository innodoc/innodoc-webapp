import { fork, takeLatest } from 'redux-saga/effects'

import { actionTypes } from '@innodoc/client-store/src/actions/i18n'
import { notifyI18next, waitForDetectedLanguage } from './i18n'

export default [
  fork(waitForDetectedLanguage),
  takeLatest(actionTypes.CHANGE_LANGUAGE, notifyI18next),
]
