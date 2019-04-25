export const actionTypes = {
  QUESTION_ANSWERED: 'QUESTION_ANSWERED',
  QUESTION_SOLVED: 'QUESTION_SOLVED',
}

export function questionAnswered(data) {
  return {
    data,
    type: actionTypes.QUESTION_ANSWERED,
  }
}

export function questionSolved(data) {
  return {
    data,
    type: actionTypes.QUESTION_SOLVED,
  }
}
