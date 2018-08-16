import { call, put, select } from 'redux-saga/effects'

import { selectors } from '../../store/reducers/content'
import { selectors as i18nSelectors } from '../../store/reducers/i18n'
import { loadSectionSuccess, loadSectionFailure } from '../../store/actions/content'
import { fetchSection } from '../../lib/api'
import { showMessage } from '../../store/actions/ui'

export default function* loadSectionSaga({ id }) {
  const language = yield select(i18nSelectors.getLanguage)
  if (language) {
    // already in store?
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
}
