import {
  fork,
  put,
  take,
  call,
} from 'redux-saga/effects'

import {
  exerciseInputCompleted,
  actionTypes as exerciseActionTypes,
} from '../../store/actions/exercises'
import validators from '../../lib/validators'

function* exerciseInputChanged(payload) {
  const {
    attrs, id, inputValue, solved: isSolved, solution, // validator,
  } = payload.data

  // Get validator
  const validator = validators[attrs.questionType]
  const solved = yield call(
    validator.validate, inputValue, solution, attrs
  )

  if (solved !== isSolved) {
    yield put(exerciseInputCompleted({ id, inputValue, solved }))
  }
}

export default function* watchExerciseChange() {
  while (true) {
    const data = yield take(exerciseActionTypes.EXERCISE_INPUT_COMPLETED)
    yield fork(exerciseInputChanged, data)
  }
}
