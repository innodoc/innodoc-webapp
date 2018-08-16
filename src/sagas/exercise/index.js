import { fork } from 'redux-saga/effects'

import watchExerciseChange from './exercise'

export default [
  fork(watchExerciseChange),
]
