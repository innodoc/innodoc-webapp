export const actionTypes = {
  EXERCISE_COMPLETED: 'EXERCISE_COMPLETED',
}

export function exerciseCompleted(data) {
  return {
    type: actionTypes.EXERCISE_COMPLETED,
    data,
  }
}
