import { fork, takeLatest } from 'redux-saga/effects'

import { actionTypes } from '../../store/actions/i18n'
import { notifyI18next, waitForDetectedLanguage } from './i18n'

export default [
  fork(waitForDetectedLanguage),
  takeLatest(actionTypes.CHANGE_LANGUAGE, notifyI18next),
]
