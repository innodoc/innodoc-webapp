import { makeSymbolObj } from '@innodoc/misc/utils'

export const actionTypes = makeSymbolObj(['RESET_EXERCISE'])

export const resetExercise = (id) => ({
  type: actionTypes.RESET_EXERCISE,
  id,
})
