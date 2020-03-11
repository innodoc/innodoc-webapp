import { takeEvery } from 'redux-saga/effects'

import { actionTypes as contentActionTypes } from '@innodoc/client-store/src/actions/content'
import { actionTypes as userActionTypes } from '@innodoc/client-store/src/actions/user'
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
  takeEvery(
    userActionTypes.LOGIN_USER_FAILURE,
    makeShowMessageSaga('warning', 'loginUserFailure', true)
  ),
  takeEvery(
    userActionTypes.LOGIN_USER_SUCCESS,
    makeShowMessageSaga('success', 'loginUserSuccess', true)
  ),
  takeEvery(
    userActionTypes.REGISTER_USER_FAILURE,
    makeShowMessageSaga('warning', 'registerUserFailure', true)
  ),
  takeEvery(
    userActionTypes.REGISTER_USER_SUCCESS,
    makeShowMessageSaga('success', 'registerUserSuccess', true)
  ),
]
