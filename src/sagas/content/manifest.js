import { call, put, select } from 'redux-saga/effects'

import appSelectors from '../../store/selectors'
import courseSelectors from '../../store/selectors/course'
import { changeCourse, loadManifestSuccess, loadManifestFailure } from '../../store/actions/content'
import { showMessage } from '../../store/actions/ui'
import { fetchManifest } from '../../lib/api'

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
