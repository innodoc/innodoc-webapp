import {
  fork,
  put,
  take,
  call,
} from 'redux-saga/effects'

import {
  exerciseToggleSolved,
  actionTypes as exerciseActionTypes,
} from '../../store/actions/exercises'

function* exerciseInputChanged(payload) {
  const {
    uuid, inputValue, solved: isSolved, solution, validator,
  } = payload.data

  const solved = yield call(
    validator.validate, inputValue, solution, validator.args
  )

  if (solved !== isSolved) {
    yield put(exerciseToggleSolved({ uuid, solved }))
  }
}

export default function* watchExerciseChange() {
  while (true) {
    const data = yield take(exerciseActionTypes.EXERCISE_INPUT_CHANGED)
    yield fork(exerciseInputChanged, data)
  }
}
