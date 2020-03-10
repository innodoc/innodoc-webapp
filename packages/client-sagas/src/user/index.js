import { takeLeading } from 'redux-saga/effects'

import { actionTypes as userActionTypes } from '@innodoc/client-store/src/actions/user'
import registerUserSaga from './registerUserSaga'

export default [takeLeading(userActionTypes.REGISTER_USER, registerUserSaga)]
