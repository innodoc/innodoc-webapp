import { util } from '@innodoc/misc'

export const actionTypes = util.makeSymbolObj(['RESET_EXERCISE'])

export const resetExercise = (id) => ({
  type: actionTypes.RESET_EXERCISE,
  id,
})
