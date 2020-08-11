import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { call, select } from 'redux-saga/effects'

import { contentNotFound } from '@innodoc/client-store/src/actions/content'
import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { parseContentId } from '@innodoc/client-misc/src/util'

import makeLoadContentSaga from './makeLoadContentSaga'
import loadManifestSaga from './loadManifestSaga'

const loadContentFailure = (error) => ({
  type: 'LOAD_CONTENT_FAILURE',
  error,
})

const loadContentSuccess = (data) => ({
  type: 'LOAD_CONTENT_SUCCESS',
  data,
})

const loadContent = (contentId, prevLanguage = undefined) => ({
  type: 'LOAD_CONTENT',
  prevLanguage,
  contentId,
})

const getCurrentContent = () => {}
const contentExists = () => {}
const getContent = () => {}
const fetchContent = () => {}
const loadContentSaga = makeLoadContentSaga(
  getCurrentContent,
  contentExists,
  getContent,
  loadContentSuccess,
  loadContentFailure,
  fetchContent
)

describe('makeLoadContentSaga', () => {
  const language = 'en'
  const contentRoot = 'https://foo.com/content'
  const contentIdHash = 'foo/bar#baz'
  const contentId = 'foo/bar'
  const fetchedContent = { [language]: ['content'] }
  const content = { id: contentId, content: fetchedContent }

  const defaultProvides = [
    [select(appSelectors.getApp), { language, contentRoot }],
    [call(parseContentId, contentIdHash), [contentId, 'baz']],
    [select(courseSelectors.getCurrentCourse), { id: 0 }],
    [select(getCurrentContent), { id: null }],
    [select(contentExists, contentId), true],
    [select(getContent, contentId), { id: 0 }],
    [matchers.call.fn(fetchContent), fetchedContent[language]],
  ]

  it('should not loadManifest with currentCourse', () =>
    expectSaga(loadContentSaga, { contentId: contentIdHash })
      .provide(defaultProvides)
      .not.call(loadManifestSaga)
      .run())

  it('should loadManifest without currentCourse', () =>
    expectSaga(loadContentSaga, loadContent(contentIdHash))
      .provide([[select(courseSelectors.getCurrentCourse), null], ...defaultProvides])
      .call(loadManifestSaga)
      .silentRun(0))

  it("should do nothing if content didn't actually change", () =>
    expectSaga(loadContentSaga, loadContent(contentIdHash, 'en'))
      .provide([[select(getCurrentContent), { id: 'foo/bar' }], ...defaultProvides])
      .not.call.fn(fetchContent)
      .not.put.actionType('LOAD_CONTENT_SUCCESS')
      .not.put.actionType('LOAD_CONTENT_FAILURE')
      .run())

  it('should put contentNotFound for non-existent contentId', () =>
    expectSaga(loadContentSaga, loadContent(contentIdHash))
      .provide([[select(contentExists, contentId), false], ...defaultProvides])
      .put(contentNotFound())
      .not.call.fn(fetchContent)
      .not.put.actionType('LOAD_CONTENT_SUCCESS')
      .run())

  it('should fetch content', () =>
    expectSaga(loadContentSaga, loadContent(contentIdHash))
      .provide(defaultProvides)
      .call(fetchContent, contentRoot, language, contentId)
      .put(
        loadContentSuccess({
          language,
          contentId,
          content: fetchedContent[language],
        })
      )
      .not.put.actionType('LOAD_CONTENT_FAILURE')
      .run())

  it('should put loadContentFailure if fetch fails', () => {
    const error = new Error('mock error')
    return expectSaga(loadContentSaga, loadContent(contentIdHash))
      .provide([[matchers.call.fn(fetchContent), throwError(error)], ...defaultProvides])
      .put(loadContentFailure(error))
      .not.put.actionType('LOAD_CONTENT_SUCCESS')
      .run()
  })

  it('should get content from cache', () =>
    expectSaga(loadContentSaga, loadContent(contentIdHash))
      .provide([[select(getContent, contentId), content], ...defaultProvides])
      .not.call.fn(fetchContent)
      .put(
        loadContentSuccess({
          language,
          contentId,
          content: fetchedContent[language],
        })
      )
      .run())
})
