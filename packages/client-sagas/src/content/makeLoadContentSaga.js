import { call, put, select } from 'redux-saga/effects'

import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { clearError } from '@innodoc/client-store/src/actions/content'
import { showMessage } from '@innodoc/client-store/src/actions/ui'
import { parseContentId } from '@innodoc/client-misc/src/util'

import loadManifestSaga from './loadManifestSaga'

export default (
  getCurrentContent,
  contentExists,
  getContent,
  loadContentSuccess,
  loadContentFailure,
  fetchContent
) => {
  function* loadContentSaga({ contentId: contentIdHash, prevLanguage }) {
    const { contentRoot, language } = yield select(appSelectors.getApp)
    const [contentId] = yield call(parseContentId, contentIdHash)

    // Load manifest if course does not exist
    if (!(yield select(courseSelectors.getCurrentCourse))) {
      yield call(loadManifestSaga)
    }

    // Clear potential previous error
    yield put(clearError())

    // Do not load exact same content another time
    const currentContent = yield select(getCurrentContent)
    if (
      currentContent &&
      currentContent.id === contentId &&
      language === prevLanguage
    ) {
      return
    }

    // Check if constent exists
    if (yield select(contentExists, contentId)) {
      // Check if fetched already
      const content = yield select(getContent, contentId)
      if (content.content && content.content[language]) {
        yield put(
          loadContentSuccess({
            language,
            contentId,
            content: content.content[language],
          })
        )
      } else {
        // Fetch from remote
        try {
          yield put(
            loadContentSuccess({
              content: yield call(
                fetchContent,
                contentRoot,
                language,
                contentId
              ),
              contentId,
              language,
            })
          )
        } catch (error) {
          yield put(loadContentFailure(error))
          yield put(
            showMessage({
              title: 'Loading content failed!',
              msg: error.message,
              level: 'error',
            })
          )
        }
      }
    } else {
      yield put(loadContentFailure({ statusCode: 404 }))
    }
  }
  return loadContentSaga
}
