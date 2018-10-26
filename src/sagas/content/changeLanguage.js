import { put, select } from 'redux-saga/effects'

import { loadManifest, loadSection } from '../../store/actions/content'
import selectors from '../../store/selectors/content'

// When the language changes we may need to (re-)load content.
export default function* changeLanguage() {
  yield put(loadManifest())
  const sectionPath = yield select(selectors.getCurrentSectionPath)
  if (sectionPath) {
    yield put(loadSection(sectionPath))
  }
}
