import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { select } from 'redux-saga/effects'
import { actionTypes as uiActionTypes } from '../../store/actions/ui'

import loadManifestSaga from './manifest'
import {
  actionTypes as contentActionTypes,
  loadManifestFailure,
  loadManifestSuccess,
} from '../../store/actions/content'
import appSelectors from '../../store/selectors'
import courseSelectors from '../../store/selectors/course'
import { fetchManifest } from '../../lib/api'

describe('loadManifestSaga', () => {
  const language = 'en'
  const contentRoot = 'https://foo.com/content'
  const content = { title: 'course title' }
  const course = { id: 0 }
  const defaultProvides = [
    [select(appSelectors.getApp), { language, contentRoot }],
    [select(courseSelectors.getCurrentCourse), null],
    [select(courseSelectors.getCourses), [course]],
    [matchers.call.fn(fetchManifest), content],
  ]

  it('should fetch manifest and change course', () => expectSaga(loadManifestSaga)
    .provide(defaultProvides)
    .call(fetchManifest, contentRoot)
    .put(loadManifestSuccess({ content }))
    .put.actionType(contentActionTypes.CHANGE_COURSE)
    .not.put.actionType(contentActionTypes.LOAD_SECTION_FAILURE)
    .run()
  )

  it('should get manifest from cache', () => expectSaga(loadManifestSaga)
    .provide([
      [select(courseSelectors.getCurrentCourse), course],
      ...defaultProvides,
    ])
    .not.put.actionType(contentActionTypes.LOAD_MANIFEST_SUCCESS)
    .not.put.actionType(contentActionTypes.LOAD_MANIFEST_FAILURE)
    .run()
  )

  it('should fail and show message if fetch fails', () => {
    const error = new Error('mock error')
    return expectSaga(loadManifestSaga)
      .provide([
        [matchers.call.fn(fetchManifest), throwError(error)],
        ...defaultProvides,
      ])
      .put(loadManifestFailure({ error }))
      .put.actionType(uiActionTypes.SHOW_MESSAGE)
      .not.put.actionType(contentActionTypes.LOAD_MANIFEST_SUCCESS)
      .run()
  })
})
