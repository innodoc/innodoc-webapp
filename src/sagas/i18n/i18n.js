import { call, put, take } from 'redux-saga/effects'
import nextI18next from '../../lib/i18n'
import { actionTypes, changeLanguage } from '../../store/actions/i18n'
import { toTwoLetterCode } from '../../lib/util'

// Notify i18next about language changes.
export function* notifyI18next({ language }) {
  yield call([nextI18next.i18n, nextI18next.i18n.changeLanguage], language)
}

// Wait for i18next to detect language.
export function* waitForDetectedLanguage() {
  const { language: detectedLanguage } = yield take(actionTypes.LANGUAGE_DETECTED)
  const language = yield call(toTwoLetterCode, detectedLanguage)
  yield put(changeLanguage(language))
}
