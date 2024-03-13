import { createContext } from 'react'

type ExerciseContextValue = Record<string, never>

const ExerciseContext = createContext<ExerciseContextValue>({})

export default ExerciseContext
