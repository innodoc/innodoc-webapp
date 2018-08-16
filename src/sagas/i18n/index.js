import { fork } from 'redux-saga/effects'

import watchI18nInstanceAvailable from './i18n'

export default [
  fork(watchI18nInstanceAvailable),
]
