import { call, put, select } from 'redux-saga/effects'
import { registerUser } from '@innodoc/client-misc/src/api'
import {
  registerUserFailure,
  registerUserSuccess,
} from '@innodoc/client-store/src/actions/user'

import appSelectors from '@innodoc/client-store/src/selectors'

export default function* registerUserSaga({ email, password }) {
  const { appRoot } = yield select(appSelectors.getApp)
  try {
    yield call(registerUser, appRoot, email, password)
    yield put(registerUserSuccess(email))
  } catch (error) {
    yield put(registerUserFailure(email, error))
  }
}
