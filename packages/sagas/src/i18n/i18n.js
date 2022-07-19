import i18n from 'i18next'
import { call, fork, getContext, put, setContext, take, takeLatest } from 'redux-saga/effects'

import { actionTypes, changeLanguage } from '@innodoc/store/src/actions/i18n'

import { util } from '@innodoc/misc'

// Notify i18next about language changes
// export function* notifyI18nextSaga({ language }) {
//   console.log('notifyI18next language=', language)
//   const i18next = yield getContext('i18next')
//   console.log('notifyI18next i18next=', i18next)
//   if (!i18next) {
//     console.log('  No i18n instance found...')
//   } else {
//     console.log('  Got i18n instance')
//     console.log('    i18n.language', i18next.language)
//     console.log('    i18next.resolvedLanguage', i18next.resolvedLanguage)
//     yield call([i18next, i18next.changeLanguage], language)
//   }
// }

export function* waitForNotifyI18nextSaga(i18next) {
  console.log('waitForNotifyI18nextSaga')
  while (true) {
    yield take(actionTypes.CHANGE_LANGUAGE)
    console.log('GOT CHANGE_LANGUAGE')
    console.log('  i18next=', i18next)
    console.log('  i18next.changeLanguage=', i18next.changeLanguage)

    console.log('  i18n=', i18n)
    console.log('  i18n.changeLanguage=', i18n.changeLanguage)
  }
}

// Wait i18next instance
export function* waitForI18NextSaga() {
  console.log('waitForI18NextSaga')
  const { i18next, language: detectedLanguage } = yield take(actionTypes.SET_I18NEXT)
  console.log('waitForI18NextSaga i18next=', i18next, 'language=', detectedLanguage)
  // yield setContext({ i18next })
  const language = yield call(util.toTwoLetterCode, detectedLanguage) // TODO: toTwoLetterCode needed??
  // yield fork(takeLatest(actionTypes.CHANGE_LANGUAGE, notifyI18nextSaga))
  yield fork(waitForNotifyI18nextSaga, i18next)
  yield put(changeLanguage(language))
}

// export function* waitForDetectedLanguageSaga() {
//   const { language: detectedLanguage } = yield take(actionTypes.LANGUAGE_DETECTED)
//   console.log('waitForDetectedLanguage', detectedLanguage)
// }
