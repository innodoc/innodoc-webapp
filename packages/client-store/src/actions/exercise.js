import { util } from '@innodoc/client-misc'

export const actionTypes = util.makeSymbolObj(['RESET_EXERCISE'])

export const resetExercise = (id) => ({
  type: actionTypes.RESET_EXERCISE,
  id,
})
