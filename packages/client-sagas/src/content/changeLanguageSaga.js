import { put, select } from 'redux-saga/effects'

import { loadFragment, loadPage, loadSection } from '@innodoc/client-store/src/actions/content'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

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
  yield put(loadFragment('_footer_a'))
  yield put(loadFragment('_footer_b'))
}
