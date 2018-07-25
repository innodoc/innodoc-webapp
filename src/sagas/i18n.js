import {
  call,
  fork,
  getContext,
  take,
  setContext,
  put,
} from 'redux-saga/effects'
import { actionTypes, changeLanguage } from '../store/actions/i18n'

// Notify i18next about language changes
export function* watchChangeLanguage() {
  while (true) {
    const { language } = yield take(actionTypes.CHANGE_LANGUAGE)
    const i18n = yield getContext('i18n')
    yield call([i18n, i18n.changeLanguage], language)
  }
}

// Wait for i18n instance and set initial language
export default function* watchI18n() {
  const { i18n } = yield take(actionTypes.I18N_CREATED)
  yield setContext({ i18n })
  yield fork(watchChangeLanguage)
  yield put(changeLanguage(i18n.language))
}
