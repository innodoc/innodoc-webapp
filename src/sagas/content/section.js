import {
  call,
  fork,
  put,
  select,
  take,
} from 'redux-saga/effects'

import { selectors } from '../../store/reducers/content'
import { selectors as i18nSelectors } from '../../store/reducers/i18n'
import {
  actionTypes,
  loadSectionSuccess,
  loadSectionFailure,
} from '../../store/actions/content'
import { actionTypes as i18nActionTypes } from '../../store/actions/i18n'
import { fetchSection } from '../../lib/api'
import { showMessage } from '../../store/actions/ui'

export function* loadSection(language, id) {
  // query cache
  let content = yield select(selectors.getSectionContent, language, id)
  if (content) {
    yield put(loadSectionSuccess({ language, id, content }))
  } else {
    // fetch from remote
    try {
      content = yield call(fetchSection, language, id)
      yield put(loadSectionSuccess({ language, id, content }))
    } catch (error) {
      yield put(loadSectionFailure({ language, error }))
      yield put(showMessage({
        title: 'Loading section failed!',
        msg: error.message,
        level: 'error',
      }))
    }
  }
}

export default function* watchLoadSection() {
  while (true) {
    const { id } = yield take(actionTypes.LOAD_SECTION)
    let language = yield select(i18nSelectors.getLanguage) // TODO: DRY, exists in toc.js
    if (!language) {
      yield take(i18nActionTypes.CHANGE_LANGUAGE)
      language = yield select(i18nSelectors.getLanguage)
    }
    yield fork(loadSection, language, id)
  }
}
