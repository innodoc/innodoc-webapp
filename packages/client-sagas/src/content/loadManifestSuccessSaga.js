import { END } from 'redux-saga'
import { put, select } from 'redux-saga/effects'

import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { changeCourse } from '@innodoc/client-store/src/actions/content'

export default function* loadManifestSuccessSaga() {
  const courses = yield select(courseSelectors.getCourses)
  yield put(changeCourse(courses[0]))

  // Stop sagas on server
  if (typeof window === 'undefined') {
    yield put(END)
  }
}
