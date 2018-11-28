import { put, select } from 'redux-saga/effects'

import { loadSection } from '../../store/actions/content'
import selectors from '../../store/selectors/course'

// When the language changes we may need to (re-)load content.
export default function* changeLanguage() {
  const course = yield select(selectors.getCurrentCourse)
  if (course && course.currentSectionId) {
    yield put(loadSection(course.currentSectionId))
  }
}
