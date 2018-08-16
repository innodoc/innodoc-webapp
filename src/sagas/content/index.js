import { fork } from 'redux-saga/effects'

import watchLoadToc from './toc'
import watchLoadSection from './section'

export default [
  fork(watchLoadToc),
  fork(watchLoadSection),
]
