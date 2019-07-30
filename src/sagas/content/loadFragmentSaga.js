import { call, put, select } from 'redux-saga/effects'

import appSelectors from '../../store/selectors'
import fragmentSelectors from '../../store/selectors/fragment'
import { loadFragmentFailure, loadFragmentSuccess } from '../../store/actions/content'
import { showMessage } from '../../store/actions/ui'
import { fetchFragment } from '../../lib/api'

export default function* loadFragmentSaga({ contentId }) {
  const { contentRoot, language } = yield select(appSelectors.getApp)
  try {
    // Check if fetched already
    const fragment = yield select(fragmentSelectors.getFragment, contentId)
    if (fragment && fragment.content[language]) {
      yield put(loadFragmentSuccess({
        language,
        contentId,
        content: fragment.content[language],
      }))
    } else {
      // Fetch from remote
      const content = yield call(fetchFragment, contentRoot, language, contentId)
      yield put(loadFragmentSuccess({
        language,
        contentId,
        content,
      }))
    }
  } catch (error) {
    yield put(loadFragmentFailure({ error }))
    yield put(showMessage({
      level: 'fatal',
      msg: error.message,
      title: 'Loading fragment failed!',
    }))
  }
}
