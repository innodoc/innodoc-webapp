import { createContext } from 'react'

interface ExerciseContextValue {}

const ExerciseContext = createContext<ExerciseContextValue>({})

export default ExerciseContext
