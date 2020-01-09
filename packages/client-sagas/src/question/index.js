import { fork } from 'redux-saga/effects'

import watchQuestionChange from './question'

export default [fork(watchQuestionChange)]
