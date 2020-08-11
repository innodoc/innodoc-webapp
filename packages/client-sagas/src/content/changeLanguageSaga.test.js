import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'

import {
  actionTypes as contentActionTypes,
  loadPage,
  loadSection,
} from '@innodoc/client-store/src/actions/content'
import { changeLanguage } from '@innodoc/client-store/src/actions/i18n'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

import changeLanguageSaga from './changeLanguageSaga'

describe('changeLanguageSaga', () => {
  it('should reload section content', () =>
    expectSaga(changeLanguageSaga, changeLanguage('pl', 'fr'))
      .provide([[select(courseSelectors.getCurrentCourse), { id: 0, currentSectionId: 'foo' }]])
      .put(loadSection('foo', 'fr'))
      .run())

  it('should reload page content', () =>
    expectSaga(changeLanguageSaga, changeLanguage('pl', 'fr'))
      .provide([[select(courseSelectors.getCurrentCourse), { id: 0, currentPageId: 'bar' }]])
      .put(loadPage('bar', 'fr'))
      .run())

  it('should not reload content without course', () =>
    expectSaga(changeLanguageSaga, changeLanguage('pl', 'fr'))
      .provide([[select(courseSelectors.getCurrentCourse), null]])
      .not.put.actionType(contentActionTypes.LOAD_SECTION)
      .run())
})
