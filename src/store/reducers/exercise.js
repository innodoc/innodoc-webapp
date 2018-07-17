import { actionTypes } from '../actions/exercises'
import defaultInitialState from '../defaultInitialState'

function exercises(state = defaultInitialState.exercises, action) {
  // https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns
  switch (action.type) {
    case actionTypes.EXERCISE_INPUT_CHANGED:
      return {
        ...state,
        [action.data.uuid]: {
          ...state[action.data.uuid],
          inputValue: action.data.inputValue,
        },
      }

    case actionTypes.EXERCISE_TOGGLE_SOLVED:
      return {
        ...state,
        [action.data.uuid]: {
          ...state[action.data.uuid],
          solved: action.data.solved,
        },
      }

    default:
      return state
  }
}

export default exercises
