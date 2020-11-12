import { makeSymbolObj } from '@innodoc/client-misc/src/util'

export const actionTypes = makeSymbolObj(['RESET_EXERCISE'])

export const resetExercise = (id) => ({
  type: actionTypes.RESET_EXERCISE,
  id,
})
