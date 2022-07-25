import { fork } from 'redux-saga/effects'

import progressSaga from './progressSaga.js'

export default typeof window === 'undefined' ? [] : [fork(progressSaga)]
