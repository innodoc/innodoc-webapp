import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { select } from 'redux-saga/effects'
import { actionTypes as uiActionTypes } from '../../store/actions/ui'

import loadFragmentSaga from './loadFragmentSaga'
import {
  actionTypes,
  loadFragment,
  loadFragmentFailure,
  loadFragmentSuccess,
} from '../../store/actions/content'
import appSelectors from '../../store/selectors'
import fragmentSelectors from '../../store/selectors/fragment'
import { fetchFragment } from '../../lib/api'

describe('loadFragmentSaga', () => {
  const language = 'en'
  const contentRoot = 'https://foo.com/content'
  const contentId = 'foo/bar'
  const fetchedContent = { [language]: ['content'] }
  const fragment = { id: contentId, content: fetchedContent }

  const defaultProvides = [
    [select(appSelectors.getApp), { language, contentRoot }],
    [select(fragmentSelectors.getFragment, contentId), { id: 0, content: {} }],
    [matchers.call.fn(fetchFragment), fetchedContent[language]],
  ]

  it('should fetch content',
    () => expectSaga(loadFragmentSaga, loadFragment(contentId))
      .provide(defaultProvides)
      .call(fetchFragment, contentRoot, language, contentId)
      .put(loadFragmentSuccess({ language, contentId, content: fetchedContent[language] }))
      .not.put.actionType(actionTypes.LOAD_FRAGMENT_FAILURE)
      .run()
  )

  it('should get content from cache',
    () => expectSaga(loadFragmentSaga, loadFragment(contentId))
      .provide([
        [select(fragmentSelectors.getFragment, contentId), fragment],
        ...defaultProvides,
      ])
      .not.call.fn(fetchFragment)
      .put(loadFragmentSuccess({ language, contentId, content: fetchedContent[language] }))
      .run()
  )

  it('should put loadFragmentFailure and not show message if fetch fails', () => {
    const error = new Error('mock error')
    return expectSaga(loadFragmentSaga, loadFragment(contentId))
      .provide([
        [matchers.call.fn(fetchFragment), throwError(error)],
        ...defaultProvides,
      ])
      .put(loadFragmentFailure({ error }))
      .not.put.actionType(uiActionTypes.SHOW_MESSAGE)
      .not.put.actionType(actionTypes.LOAD_FRAGMENT_SUCCESS)
      .run()
  })
})
