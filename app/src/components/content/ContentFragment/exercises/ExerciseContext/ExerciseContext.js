// Provide default values
const ExerciseContext = React.createContext({
  addQuestion: () => {},
  isAnswered: false,
  isCorrect: false,
  dispatchAnswer: () => {},
  showResult: false,
})

export default ExerciseContext
