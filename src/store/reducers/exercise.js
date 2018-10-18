import { actionTypes } from '../actions/exercise'
import defaultInitialState from '../defaultInitialState'

function exercises(state = defaultInitialState.exercises, action) {
  // https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns
  switch (action.type) {
    case actionTypes.EXERCISE_INPUT_COMPLETED:
      return {
        ...state,
        [action.data.id]: {
          ...state[action.data.id],
          inputValue: action.data.inputValue,
          solved: action.data.solved,
        },
      }

    default:
      return state
  }
}

export default exercises
