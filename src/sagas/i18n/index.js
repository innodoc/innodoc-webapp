import { fork } from 'redux-saga/effects'

import watchI18nInstanceCreated from './i18n'

export default [
  fork(watchI18nInstanceCreated),
]
