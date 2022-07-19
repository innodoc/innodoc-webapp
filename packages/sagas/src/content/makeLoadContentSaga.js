import { call, put, select } from 'redux-saga/effects'

import { contentNotFound } from '@innodoc/store/src/actions/content'
import appSelectors from '@innodoc/store/src/selectors'
import { util } from '@innodoc/misc'

const makeLoadContentSaga = (
  getCurrentContent,
  contentExists,
  getContent,
  loadContentSuccess,
  loadContentFailure,
  fetchContent
) =>
  function* loadContentSaga({ contentId: contentIdHash, prevLanguage }) {
    console.log('loadContentSaga')

    const { contentRoot, language } = yield select(appSelectors.getApp)
    const [contentId] = yield call(util.parseContentId, contentIdHash)

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
        console.log('  put(loadContentSuccess(...)) from cache')
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
          console.log('  put(loadContentSuccess(...))')
          yield put(
            loadContentSuccess({
              content: yield call(fetchContent, language, contentId),
              contentId,
              language,
            })
          )
        } catch (error) {
          console.log('  put(loadContentFailure(error))')
          yield put(loadContentFailure(error))
        }
      }
    } else {
      console.log('  put(contentNotFound())')
      yield put(contentNotFound())
    }
  }

export default makeLoadContentSaga
