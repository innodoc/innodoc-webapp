import { call, put, select } from 'redux-saga/effects'

import { fetchFragment } from '@innodoc/misc/api'
import { loadFragmentFailure, loadFragmentSuccess } from '@innodoc/store/actions/content'
import { getFragment } from '@innodoc/store/selectors/fragment'
import { getApp } from '@innodoc/store/selectors/misc'

export default function* loadFragmentSaga({ contentId }) {
  const { contentRoot, language } = yield select(getApp)
  try {
    // Check if fetched already
    const fragment = yield select(getFragment, contentId)
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
      const content = yield call(fetchFragment, contentRoot, language, contentId)
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
