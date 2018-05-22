export const actionTypes = {
  EXERCISE_INPUT_CHANGED: 'EXERCISE_INPUT_CHANGED',
  EXERCISE_TOGGLE_SOLVED: 'EXERCISE_TOGGLE_SOLVED',
  EXERCISE_INPUT_SAGA: 'EXERCISE_INPUT_SAGA',
}

export function exerciseInputAsync(data) {
  return {
    type: actionTypes.EXERCISE_INPUT_SAGA,
    data,
  }
}

export function changeExerciseInput(data) {
  return {
    type: actionTypes.EXERCISE_INPUT_CHANGED,
    data,
  }
}

export function exerciseToggleSolved(data) {
  return {
    type: actionTypes.EXERCISE_TOGGLE_SOLVED,
    data,
  }
}
