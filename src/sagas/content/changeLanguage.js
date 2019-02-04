import { put, select } from 'redux-saga/effects'

import { loadSection } from '../../store/actions/content'
import courseSelectors from '../../store/selectors/course'

// When the language changes we may need to (re-)load content.
export default function* changeLanguageSaga() {
  const course = yield select(courseSelectors.getCurrentCourse)
  if (course && course.currentSectionId) {
    yield put(loadSection(course.currentSectionId))
  }
}
