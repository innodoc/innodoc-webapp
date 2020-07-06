import { fork } from 'redux-saga/effects'

import progressSaga from './progress'

export default typeof window === 'undefined' ? [] : [fork(progressSaga)]
