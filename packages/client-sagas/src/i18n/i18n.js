import { call, put, take } from 'redux-saga/effects'

import {
  actionTypes,
  changeLanguage,
} from '@innodoc/client-store/src/actions/i18n'
import nextI18next from '@innodoc/client-misc/src/i18n'
import { toTwoLetterCode } from '@innodoc/client-misc/src/util'

// Notify i18next about language changes.
export function* notifyI18next({ language }) {
  yield call([nextI18next.i18n, nextI18next.i18n.changeLanguage], language)
}

// Wait for i18next to detect language.
export function* waitForDetectedLanguage() {
  const { language: detectedLanguage } = yield take(
    actionTypes.LANGUAGE_DETECTED
  )
  const language = yield call(toTwoLetterCode, detectedLanguage)
  yield put(changeLanguage(language))
}
