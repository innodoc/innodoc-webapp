import { fork } from 'redux-saga/effects'

import watchI18n from './i18n'

export default [
  fork(watchI18n),
]
