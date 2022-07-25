import { createContext } from 'react'

// Provide default values
const ExerciseContext = createContext({
  addQuestion: () => {},
  isAnswered: false,
  isCorrect: false,
  dispatchAnswer: () => {},
  showResult: false,
})

export default ExerciseContext
