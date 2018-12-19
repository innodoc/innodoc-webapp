import {
  call,
  put,
  select,
} from 'redux-saga/effects'

import appSelectors from '../../store/selectors/app'
import courseSelectors from '../../store/selectors/course'
import sectionSelectors from '../../store/selectors/section'
import {
  clearError,
  loadSectionSuccess,
  loadSectionFailure,
} from '../../store/actions/content'
import { fetchSection } from '../../lib/api'
import { showMessage } from '../../store/actions/ui'
import loadManifestSaga from './manifest'

export default function* loadSectionSaga({ sectionId }) {
  // Load manifest if course does not exist
  if (!(yield select(courseSelectors.getCurrentCourse))) {
    yield call(loadManifestSaga)
  }

  // Clear error
  yield put(clearError())

  // Check if sectionId is valid
  const sectionTable = yield select(sectionSelectors.getSectionTable)
  const language = yield select(appSelectors.getLanguage)
  if (sectionTable.items.includes(sectionId)) {
    if (language) {
      // already in store?
      const section = yield select(sectionSelectors.getSection, sectionId)
      if (section && section.content && section.content[language]) {
        yield put(loadSectionSuccess({ language, sectionId, content: section.content[language] }))
      } else {
        // fetch from remote
        const contentRoot = yield select(appSelectors.getContentRoot)
        try {
          const content = yield call(fetchSection, contentRoot, language, sectionId)
          yield put(loadSectionSuccess({ language, sectionId, content }))
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
  } else {
    yield put(loadSectionFailure({ language, statusCode: 404 }))
  }
}
