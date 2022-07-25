import { put, select } from 'redux-saga/effects'

import { loadFragment, loadPage, loadSection } from '@innodoc/store/actions/content'
import { getCurrentCourse } from '@innodoc/store/selectors/course'

// When the language changes we may need to (re-)load content.
export default function* changeLanguageSaga({ prevLanguage }) {
  const course = yield select(getCurrentCourse)
  if (course) {
    if (course.currentSectionId) {
      yield put(loadSection(course.currentSectionId, prevLanguage))
    } else if (course.currentPageId) {
      yield put(loadPage(course.currentPageId, prevLanguage))
    }
  }
  yield put(loadFragment('_footer_a'))
  yield put(loadFragment('_footer_b'))
}
