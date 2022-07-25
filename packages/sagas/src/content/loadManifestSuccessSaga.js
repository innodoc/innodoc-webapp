import { put, select } from 'redux-saga/effects'

import { getCourses } from '@innodoc/store/selectors/course'
import { changeCourse } from '@innodoc/store/actions/content'

export default function* loadManifestSuccessSaga() {
  const courses = yield select(getCourses)
  yield put(changeCourse(courses[0]))
}
