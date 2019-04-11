import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { call, select } from 'redux-saga/effects'

import loadSectionSaga from './section'
import loadManifestSaga from './manifest'
import {
  actionTypes as contentActionTypes,
  loadSection,
  loadSectionFailure,
  loadSectionSuccess,
} from '../../store/actions/content'
import { actionTypes as uiActionTypes } from '../../store/actions/ui'
import { fetchSection } from '../../lib/api'
import { parseSectionId, scrollToHash } from '../../lib/util'
import appSelectors from '../../store/selectors'
import courseSelectors from '../../store/selectors/course'
import sectionSelectors from '../../store/selectors/section'

describe('loadSectionSaga', () => {
  const language = 'en'
  const contentRoot = 'https://foo.com/content'
  const sectionIdHash = 'foo/bar#baz'
  const sectionId = 'foo/bar'
  const content = { [language]: ['sectioncontent'] }
  const section = { id: sectionId, content }

  const defaultProvides = [
    [select(appSelectors.getApp), { language, contentRoot }],
    [call(parseSectionId, sectionIdHash), [sectionId, 'baz']],
    [select(courseSelectors.getCurrentCourse), { id: 0 }],
    [select(sectionSelectors.sectionExists, sectionId), true],
    [select(sectionSelectors.getSection, sectionId), { id: 0 }],
    [matchers.call.fn(fetchSection), content[language]],
  ]

  it('should not loadManifest with currentCourse',
    () => expectSaga(loadSectionSaga, loadSection(sectionIdHash))
      .provide(defaultProvides)
      .not.call(loadManifestSaga)
      .run()
  )

  it('should loadManifest without currentCourse',
    () => expectSaga(loadSectionSaga, loadSection(sectionIdHash))
      .provide([
        [select(courseSelectors.getCurrentCourse), null],
        ...defaultProvides,
      ])
      .call(loadManifestSaga)
      .silentRun(0)
  )

  it('should produce 404 for non-existant sectionId',
    () => expectSaga(loadSectionSaga, loadSection(sectionIdHash))
      .provide([
        [select(sectionSelectors.sectionExists, sectionId), false],
        ...defaultProvides,
      ])
      .put(loadSectionFailure({ language, statusCode: 404 }))
      .not.call.fn(fetchSection)
      .not.put.actionType(uiActionTypes.LOAD_MANIFEST_SUCCESS)
      .run()
  )

  it('should fetch a section',
    () => expectSaga(loadSectionSaga, loadSection(sectionIdHash))
      .provide(defaultProvides)
      .call(fetchSection, contentRoot, language, sectionId)
      .put(loadSectionSuccess({ language, sectionId, content: content[language] }))
      .call(scrollToHash)
      .not.put.actionType(contentActionTypes.LOAD_SECTION_FAILURE)
      .run()
  )

  it('should fail and show message if fetch fails', () => {
    const error = new Error('mock error')
    return expectSaga(loadSectionSaga, loadSection(sectionIdHash))
      .provide([
        [matchers.call.fn(fetchSection), throwError(error)],
        ...defaultProvides,
      ])
      .put(loadSectionFailure({ language, error }))
      .put.actionType(uiActionTypes.SHOW_MESSAGE)
      .not.put.actionType(contentActionTypes.LOAD_SECTION_SUCCESS)
      .run()
  })

  it('should get a section from cache',
    () => expectSaga(loadSectionSaga, loadSection(sectionIdHash))
      .provide([
        [select(sectionSelectors.getSection, sectionId), section],
        ...defaultProvides,
      ])
      .put(loadSectionSuccess({ language, sectionId, content: content[language] }))
      .not.call(scrollToHash)
      .run()
  )
})
