export const actionTypes = {
  EXERCISE_INPUT_CHANGED: 'EXERCISE_INPUT_CHANGED',
  EXERCISE_TOGGLE_SOLVED: 'EXERCISE_TOGGLE_SOLVED',
}

export function exerciseInputChanged(data) {
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
