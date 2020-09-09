import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'

import { actionTypes as contentActionTypes } from '@innodoc/client-store/src/actions/content'
import courseSelectors from '@innodoc/client-store/src/selectors/course'

import loadManifestSuccessSaga from './loadManifestSuccessSaga'

describe('loadManifestSucccessSaga', () => {
  const course = { id: 0 }
  const defaultProvides = [[select(courseSelectors.getCourses), [course]]]

  it('should change course', () =>
    expectSaga(loadManifestSuccessSaga)
      .provide(defaultProvides)
      .put.actionType(contentActionTypes.CHANGE_COURSE)
      .run())
})
