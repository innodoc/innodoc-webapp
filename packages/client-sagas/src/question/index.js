import { fork } from 'redux-saga/effects'

import watchQuestionChangeSaga from './question'

export default [fork(watchQuestionChangeSaga)]
