import React from 'react'

// We need to specify a default value in case a Context.Consumer is used
// outside of an ExerciseCard
const ExerciseContext = React.createContext({
  addQuestion: () => {},
  addQuestionAnswered: () => {},
  allAnswered: () => true,
  getShowResult: () => true,
  setAutoVerify: () => {},
  setUserTriggeredVerify: () => {},
  userTriggeredVerify: false,
})

export default ExerciseContext
