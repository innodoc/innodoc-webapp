const getQuestionInputValue = (state, id) => {
  if (state.exercises[id] !== undefined) {
    return state.exercises[id].inputValue
  }
  return ''
}

const getQuestionState = (state, id) => {
  if (state.exercises[id] !== undefined) {
    return state.exercises[id].solved
  }
  return false
}

export default {
  getQuestionInputValue,
  getQuestionState,
}
