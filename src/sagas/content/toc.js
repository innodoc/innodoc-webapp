import {
  call,
  fork,
  put,
  select,
  take,
} from 'redux-saga/effects'

import { selectors as contentSelectors } from '../../store/reducers/content'
import { selectors as i18nSelectors } from '../../store/reducers/i18n'
import {
  actionTypes as contentActionTypes,
  loadTocSuccess,
  loadTocFailure,
} from '../../store/actions/content'
import { actionTypes as i18nActionTypes } from '../../store/actions/i18n'
import { showMessage } from '../../store/actions/ui'
import { fetchToc } from '../../lib/api'

export function* loadToc(language) {
  // query cache
  let content = yield select(contentSelectors.getToc, language)
  if (content && content.length > 0) {
    yield put(loadTocSuccess({ language, content }))
  } else {
    // fetch from remote
    try {
      content = yield call(fetchToc, language)
      yield put(loadTocSuccess({ language, content }))
    } catch (error) {
      yield put(loadTocFailure({ language, error }))
      yield put(showMessage({
        title: 'Loading TOC failed!',
        msg: error.message,
        level: 'fatal',
      }))
    }
  }
}

export default function* watchLoadToc() {
  while (true) {
    yield take(contentActionTypes.LOAD_TOC)
    let language = yield select(i18nSelectors.getLanguage)
    if (!language) {
      yield take(i18nActionTypes.CHANGE_LANGUAGE)
      language = yield select(i18nSelectors.getLanguage)
    }
    yield fork(loadToc, language)
  }
}
