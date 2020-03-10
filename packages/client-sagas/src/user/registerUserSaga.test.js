import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { select } from 'redux-saga/effects'

import { registerUser } from '@innodoc/client-misc/src/api'
import {
  actionTypes as userActionTypes,
  registerUserFailure,
  registerUserSuccess,
} from '@innodoc/client-store/src/actions/user'
import appSelectors from '@innodoc/client-store/src/selectors'
import registerUserSaga from './registerUserSaga'

describe('registerUserSaga', () => {
  const defaultProvides = [
    [select(appSelectors.getApp), { appRoot: 'https://app.example.com/' }],
    [matchers.call.fn(registerUser)],
  ]

  it('should call API', () =>
    expectSaga(registerUserSaga, {
      email: 'bob@example.com',
      password: 's5cr5t',
    })
      .provide(defaultProvides)
      .call(
        registerUser,
        'https://app.example.com/',
        'bob@example.com',
        's5cr5t'
      )
      .put(registerUserSuccess('bob@example.com'))
      .not.put.actionType(userActionTypes.REGISTER_USER_FAILURE)
      .run())

  it('should put registerUserFailure if registration fails', () => {
    const error = new Error('mock error')
    return expectSaga(registerUserSaga, {
      email: 'bob@example.com',
      password: 's5cr5t',
    })
      .provide([
        [matchers.call.fn(registerUser), throwError(error)],
        ...defaultProvides,
      ])
      .call(
        registerUser,
        'https://app.example.com/',
        'bob@example.com',
        's5cr5t'
      )
      .put(registerUserFailure('bob@example.com', error))
      .not.put.actionType(userActionTypes.REGISTER_USER_SUCCESS)
      .run()
  })
})
