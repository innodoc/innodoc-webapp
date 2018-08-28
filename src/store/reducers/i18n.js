import { actionTypes } from '../actions/i18n'
import defaultInitialState from '../defaultInitialState'

function i18n(state = defaultInitialState.i18n, action) {
  switch (action.type) {
    case actionTypes.CHANGE_LANGUAGE:
      return {
        ...state,
        ...{ language: action.language },
      }

    default:
      return state
  }
}

export default i18n
