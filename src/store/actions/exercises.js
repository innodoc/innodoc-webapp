export const actionTypes = {
  EXERCISE_INPUT_COMPLETED: 'EXERCISE_INPUT_COMPLETED',
}

export function exerciseInputCompleted(data) {
  return {
    type: actionTypes.EXERCISE_INPUT_COMPLETED,
    data,
  }
}
