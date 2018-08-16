import { call, put, select } from 'redux-saga/effects'

import { selectors as contentSelectors } from '../../store/reducers/content'
import { selectors as i18nSelectors } from '../../store/reducers/i18n'
import { loadTocSuccess, loadTocFailure } from '../../store/actions/content'
import { showMessage } from '../../store/actions/ui'
import { fetchToc } from '../../lib/api'

export default function* loadTocSaga() {
  const language = yield select(i18nSelectors.getLanguage)
  if (language) {
    // already in store?
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
}
