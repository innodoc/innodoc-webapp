import { call, put, select } from 'redux-saga/effects'

import { contentNotFound } from '@innodoc/client-store/src/actions/content'
import appSelectors from '@innodoc/client-store/src/selectors'
import { parseContentId } from '@innodoc/client-misc/src/util'

const makeLoadContentSaga = (
  getCurrentContent,
  contentExists,
  getContent,
  loadContentSuccess,
  loadContentFailure,
  fetchContent
) =>
  function* loadContentSaga({ contentId: contentIdHash, prevLanguage }) {
    const { contentRoot, language } = yield select(appSelectors.getApp)
    const [contentId] = yield call(parseContentId, contentIdHash)

    // Do not load exact same content another time
    const currentContent = yield select(getCurrentContent)
    if (currentContent && currentContent.id === contentId && language === prevLanguage) {
      return
    }

    // Check if content exists
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
              content: yield call(fetchContent, contentRoot, language, contentId),
              contentId,
              language,
            })
          )
        } catch (error) {
          yield put(loadContentFailure(error))
        }
      }
    } else {
      yield put(contentNotFound())
    }
  }

export default makeLoadContentSaga
