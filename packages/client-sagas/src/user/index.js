import { takeLeading } from 'redux-saga/effects'

import { actionTypes as userActionTypes } from '@innodoc/client-store/src/actions/user'
import loginUserSaga from './loginUserSaga'
import registerUserSaga from './registerUserSaga'

export default [
  takeLeading(userActionTypes.LOGIN_USER, loginUserSaga),
  takeLeading(userActionTypes.REGISTER_USER, registerUserSaga),
]
