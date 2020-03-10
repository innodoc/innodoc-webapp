import { takeEvery } from 'redux-saga/effects'

import { actionTypes as contentActionTypes } from '@innodoc/client-store/src/actions/content'
import makeShowMessageSaga from './makeShowMessageSaga'

export default [
  takeEvery(
    contentActionTypes.LOAD_MANIFEST_FAILURE,
    makeShowMessageSaga('error', 'loadManifestFailure', false)
  ),
  takeEvery(
    contentActionTypes.LOAD_PAGE_FAILURE,
    makeShowMessageSaga('error', 'loadPageFailure', true)
  ),
  takeEvery(
    contentActionTypes.LOAD_SECTION_FAILURE,
    makeShowMessageSaga('error', 'loadSectionFailure', true)
  ),
]
