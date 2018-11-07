import { call, put, select } from 'redux-saga/effects'

import appSelectors from '../../store/selectors/app'
import sectionSelectors from '../../store/selectors/section'
import { loadTocSuccess, loadTocFailure } from '../../store/actions/content'
import { showMessage } from '../../store/actions/ui'
import { fetchToc } from '../../lib/api'

export default function* loadTocSaga() {
  const language = yield select(appSelectors.getLanguage)
  if (language) {
    // already in store?
    let content = yield select(sectionSelectors.getToc)
    if (content && content.length > 0) {
      yield put(loadTocSuccess({ language, parsed: true }))
    } else {
      // fetch from remote
      const contentRoot = yield select(appSelectors.getContentRoot)
      try {
        content = yield call(fetchToc, contentRoot, language)
        yield put(loadTocSuccess({ language, content, parsed: false }))
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
