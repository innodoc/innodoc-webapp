import { put, select } from 'redux-saga/effects'

import { loadToc, loadSection } from '../../store/actions/content'
import selectors from '../../store/selectors/content'

// When the language changes we may need to (re-)load content.
export default function* changeLanguage() {
  yield put(loadToc())
  const sectionId = yield select(selectors.getCurrentSectionPath)
  if (sectionId) {
    yield put(loadSection(sectionId))
  }
}
