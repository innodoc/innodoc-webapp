import {
  call,
  take,
  takeLatest,
  put,
} from 'redux-saga/effects'
import { actionTypes, changeLanguage } from '../../store/actions/i18n'
import { toTwoLetterCode } from '../../lib/i18n'

// Notify i18next about language changes
export function* notifyI18next(i18n, { language }) {
  yield call([i18n, i18n.changeLanguage], language)
}

// Wait for i18n instance and set initial language. i18next does language
// detection. Once the initial language is set, the store becomes the
// source of truth.
export default function* watchI18nInstanceAvailable() {
  const { i18n } = yield take(actionTypes.I18N_INSTANCE_AVAILABLE)
  // normalize language (header might give something like 'en-US' but we're
  // using the two-letter code.
  const language = yield call(toTwoLetterCode, i18n.language)
  yield put(changeLanguage(language))
  // yield setContext({ i18n })
  yield takeLatest(actionTypes.CHANGE_LANGUAGE, notifyI18next, i18n)
}
