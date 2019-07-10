import { put, select } from 'redux-saga/effects'

import { loadPage, loadSection } from '../../store/actions/content'
import courseSelectors from '../../store/selectors/course'

// When the language changes we may need to (re-)load content.
export default function* changeLanguageSaga({ prevLanguage }) {
  const course = yield select(courseSelectors.getCurrentCourse)
  if (course) {
    if (course.currentSection) {
      yield put(loadSection(course.currentSection, prevLanguage))
    } else if (course.currentPage) {
      yield put(loadPage(course.currentPage, prevLanguage))
    }
  }
}
