export const actionTypes = {
  QUESTION_ANSWERED: 'QUESTION_ANSWERED',
  QUESTION_SOLVED: 'QUESTION_SOLVED',
}

export const questionAnswered = data => ({
  data,
  type: actionTypes.QUESTION_ANSWERED,
})

export const questionSolved = data => ({
  data,
  type: actionTypes.QUESTION_SOLVED,
})
