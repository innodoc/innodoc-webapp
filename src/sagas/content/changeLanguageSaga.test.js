import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'

import changeLanguageSaga from './changeLanguageSaga'
import { actionTypes as contentActionTypes, loadPage, loadSection } from '../../store/actions/content'
import { changeLanguage } from '../../store/actions/i18n'
import courseSelectors from '../../store/selectors/course'

describe('changeLanguageSaga', () => {
  it('should reload section content', () => expectSaga(changeLanguageSaga, changeLanguage('pl', 'fr'))
    .provide([[select(courseSelectors.getCurrentCourse), { id: 0, currentSection: 'foo' }]])
    .put(loadSection('foo', 'fr'))
    .run()
  )

  it('should reload page content', () => expectSaga(changeLanguageSaga, changeLanguage('pl', 'fr'))
    .provide([[select(courseSelectors.getCurrentCourse), { id: 0, currentPage: 'bar' }]])
    .put(loadPage('bar', 'fr'))
    .run()
  )

  it('should not reload content without course', () => expectSaga(changeLanguageSaga, changeLanguage('pl', 'fr'))
    .provide([[select(courseSelectors.getCurrentCourse), null]])
    .not.put.actionType(contentActionTypes.LOAD_SECTION)
    .run()
  )
})
