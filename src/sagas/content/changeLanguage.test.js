import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'

import changeLanguageSaga from './changeLanguage'
import { actionTypes as contentActionTypes, loadSection } from '../../store/actions/content'
import courseSelectors from '../../store/selectors/course'

describe('changeLanguageSaga', () => {
  it('should reload content', () => expectSaga(changeLanguageSaga)
    .provide([[select(courseSelectors.getCurrentCourse), { id: 0, currentSection: 'foo' }]])
    .put(loadSection('foo'))
    .run()
  )

  it('should not reload content without course', () => expectSaga(changeLanguageSaga)
    .provide([[select(courseSelectors.getCurrentCourse), null]])
    .not.put.actionType(contentActionTypes.LOAD_SECTION)
    .run()
  )
})
