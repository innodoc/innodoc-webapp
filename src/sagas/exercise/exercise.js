import {
  call,
  fork,
  put,
  take,
} from 'redux-saga/effects'

import {
  actionTypes as exerciseActionTypes,
  exerciseCompleted,
} from '../../store/actions/exercise'
import validators from '../../lib/validators'

export function* handleExerciseCompleted(payload) {
  const {
    attrs, inputValue, solved: isSolved, solution,
  } = payload.data

  const solved = yield call(
    validators[attrs.questionType], inputValue, solution, attrs
  )

  if (solved !== isSolved) {
    yield put(exerciseCompleted({
      solved,
      ...payload.data,
    }))
  }
}

export default function* watchExerciseChange() {
  while (true) {
    const data = yield take(exerciseActionTypes.EXERCISE_COMPLETED)
    yield fork(handleExerciseCompleted, data)
  }
}
