import { call, put, select } from 'redux-saga/effects'

import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { changeCourse, loadManifestFailure, loadManifestSuccess } from '@innodoc/client-store/src/actions/content'
import { showMessage } from '@innodoc/client-store/src/actions/ui'
import { fetchManifest } from '@innodoc/client-misc/src/api'

export default function* loadManifestSaga() {
  if (!(yield select(courseSelectors.getCurrentCourse))) {
    const { contentRoot } = yield select(appSelectors.getApp)
    try {
      const content = yield call(fetchManifest, contentRoot)
      yield put(loadManifestSuccess({ content }))
      const courses = yield select(courseSelectors.getCourses)
      yield put(changeCourse(courses[0]))
    } catch (error) {
      yield put(loadManifestFailure({ error }))
      yield put(showMessage({
        title: 'Loading content manifest failed!',
        msg: error.message,
        level: 'fatal',
      }))
    }
  }
}
