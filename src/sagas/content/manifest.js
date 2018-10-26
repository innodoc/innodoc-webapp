import { call, put, select } from 'redux-saga/effects'

import contentSelectors from '../../store/selectors/content'
import i18nSelectors from '../../store/selectors/i18n'
import { loadManifestSuccess, loadManifestFailure } from '../../store/actions/content'
import { showMessage } from '../../store/actions/ui'
import { fetchManifest } from '../../lib/api'

export default function* loadManifestSaga() {
  const language = yield select(i18nSelectors.getLanguage)
  if (language) {
    // already in store?
    let content = yield select(contentSelectors.getManifest)
    if (content && content.length > 0) {
      yield put(loadManifestSuccess({ language, content }))
    } else {
      // fetch from remote
      const contentRoot = yield select(contentSelectors.getContentRoot)
      try {
        content = yield call(fetchManifest, contentRoot, language)
        yield put(loadManifestSuccess({ language, content }))
      } catch (error) {
        yield put(loadManifestFailure({ language, error }))
        yield put(showMessage({
          title: 'Loading manifest failed!',
          msg: error.message,
          level: 'fatal',
        }))
      }
    }
  }
}
