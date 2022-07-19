import { call, put, select } from 'redux-saga/effects'

import appSelectors from '@innodoc/store/src/selectors'
import fragmentSelectors from '@innodoc/store/src/selectors/fragment'
import { loadFragmentFailure, loadFragmentSuccess } from '@innodoc/store/src/actions/content'
import { api } from '@innodoc/misc'

export default function* loadFragmentSaga({ contentId }) {
  const { contentRoot, language } = yield select(appSelectors.getApp)
  try {
    // Check if fetched already
    const fragment = yield select(fragmentSelectors.getFragment, contentId)
    if (fragment && fragment.content[language]) {
      yield put(
        loadFragmentSuccess({
          language,
          contentId,
          content: fragment.content[language],
        })
      )
    } else {
      // Fetch from remote
      const content = yield call(api.fetchFragment, contentRoot, language, contentId)
      yield put(
        loadFragmentSuccess({
          language,
          contentId,
          content,
        })
      )
    }
  } catch (error) {
    yield put(loadFragmentFailure(error))
  }
}
