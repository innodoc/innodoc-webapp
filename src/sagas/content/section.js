import {
  call,
  put,
  select,
} from 'redux-saga/effects'

import appSelectors from '../../store/selectors'
import courseSelectors from '../../store/selectors/course'
import sectionSelectors from '../../store/selectors/section'
import {
  clearError,
  loadSectionFailure,
  loadSectionSuccess,
} from '../../store/actions/content'
import { fetchSection } from '../../lib/api'
import { parseSectionId, scrollToHash } from '../../lib/util'
import { showMessage } from '../../store/actions/ui'
import loadManifestSaga from './manifest'

export default function* loadSectionSaga({ sectionId: sectionIdHash }) {
  const { language, contentRoot } = yield select(appSelectors.getApp)
  const [sectionId] = yield call(parseSectionId, sectionIdHash)

  // Load manifest if course does not exist
  if (!(yield select(courseSelectors.getCurrentCourse))) {
    yield call(loadManifestSaga)
  }

  // Clear error
  // TODO: this is strange, is both error and message really needed?
  yield put(clearError())

  // Check if section exists
  if (yield select(sectionSelectors.sectionExists, sectionId)) {
    // Check if content is fetched already
    const section = yield select(sectionSelectors.getSection, sectionId)
    if (section.content && section.content[language]) {
      yield put(loadSectionSuccess({
        language,
        sectionId,
        content: section.content[language],
      }))
    } else {
      // Fetch from remote
      try {
        const content = yield call(fetchSection, contentRoot, language, sectionId)
        yield put(loadSectionSuccess({ language, sectionId, content }))
        yield call(scrollToHash) // need to run scrollToHash manually!
      } catch (error) {
        yield put(loadSectionFailure({ language, error }))
        yield put(showMessage({
          title: 'Loading section failed!',
          msg: error.message,
          level: 'error',
        }))
      }
    }
  } else {
    yield put(loadSectionFailure({ language, statusCode: 404 }))
  }
}
