import { call, put, select } from 'redux-saga/effects'

import contentSelectors from '../../store/selectors/content'
import i18nSelectors from '../../store/selectors/i18n'
import { loadSectionSuccess, loadSectionFailure } from '../../store/actions/content'
import { fetchSection } from '../../lib/api'
import { showMessage } from '../../store/actions/ui'

export default function* loadSectionSaga({ id }) {
  const language = yield select(i18nSelectors.getLanguage)
  if (language) {
    // already in store?
    let content = yield select(contentSelectors.getSectionContent, language, id)
    if (content) {
      yield put(loadSectionSuccess({ language, id, content }))
    } else {
      // fetch from remote
      const contentRoot = yield select(contentSelectors.getContentRoot)
      try {
        content = yield call(fetchSection, contentRoot, language, id)
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
}
