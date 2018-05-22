import { put, takeEvery, call } from 'redux-saga/effects'

import {
  changeExerciseInput, exerciseToggleSolved,
  actionTypes as exerciseActionTypes,
} from '../store/actions/exercises'

function* exerciseInputChangedSaga(payload) {
  const {
    uuid, inputValue, solved: isSolved, solution, validator,
  } = payload.data

  yield put(changeExerciseInput({ uuid, inputValue }))

  const solved = yield call(
    validator.validate, inputValue, solution, validator.args
  )

  if (solved !== isSolved) {
    yield put(exerciseToggleSolved({ uuid, solved }))
  }
}

export default function* watchExerciseChange() {
  yield takeEvery(
    exerciseActionTypes.EXERCISE_INPUT_SAGA, exerciseInputChangedSaga)
}
