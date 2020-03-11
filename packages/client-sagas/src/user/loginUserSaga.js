import { call, put, select } from 'redux-saga/effects'
import { loginUser } from '@innodoc/client-misc/src/api'
import {
  loginUserFailure,
  loginUserSuccess,
} from '@innodoc/client-store/src/actions/user'

import appSelectors from '@innodoc/client-store/src/selectors'

export default function* loginUserSaga({ email, password }) {
  const { appRoot } = yield select(appSelectors.getApp)
  try {
    yield call(loginUser, appRoot, email, password)
    yield put(loginUserSuccess(email))
  } catch (error) {
    yield put(loginUserFailure(email, error.message))
  }
}
