import { put, select } from 'redux-saga/effects'

import courseSelectors from '@innodoc/store/src/selectors/course'
import { changeCourse } from '@innodoc/store/src/actions/content'

export default function* loadManifestSuccessSaga() {
  const courses = yield select(courseSelectors.getCourses)
  yield put(changeCourse(courses[0]))
}
