import { call, put, select } from 'redux-saga/effects'

import appSelectors from '../../store/selectors/app'
import sectionSelectors from '../../store/selectors/section'
import { loadSectionSuccess, loadSectionFailure } from '../../store/actions/content'
import { fetchSection } from '../../lib/api'
import { showMessage } from '../../store/actions/ui'

export default function* loadSectionSaga({ sectionPath }) {
  const language = yield select(appSelectors.getLanguage)
  if (language) {
    // already in store?
    const section = yield select(sectionSelectors.getSection, sectionPath)
    if (section && section.content && section.content[language]) {
      yield put(loadSectionSuccess({ language, sectionPath, content: section.content[language] }))
    } else {
      // fetch from remote
      const contentRoot = yield select(appSelectors.getContentRoot)
      try {
        const content = yield call(fetchSection, contentRoot, language, sectionPath)
        yield put(loadSectionSuccess({ language, sectionPath, content }))
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
