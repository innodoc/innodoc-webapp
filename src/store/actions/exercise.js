export const actionTypes = {
  EXERCISE_INPUT_COMPLETED: 'EXERCISE_INPUT_COMPLETED',
}

export function exerciseCompleted(data) {
  return {
    type: actionTypes.EXERCISE_INPUT_COMPLETED,
    data,
  }
}
