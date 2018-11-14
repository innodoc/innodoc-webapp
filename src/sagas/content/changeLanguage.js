import { put, select } from 'redux-saga/effects'

import { loadSection } from '../../store/actions/content'
import selectors from '../../store/selectors/app'

// When the language changes we may need to (re-)load content.
export default function* changeLanguage() {
  const sectionId = yield select(selectors.getCurrentSectionId)
  if (sectionId) {
    yield put(loadSection(sectionId))
  }
}
