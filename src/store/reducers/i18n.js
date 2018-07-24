import { actionTypes } from '../actions/i18n'
import defaultInitialState from '../defaultInitialState'
import { toTwoLetterCode } from '../../lib/i18n'

export const selectors = {
  getLanguage: state => state.i18n.language,
}

function i18n(state = defaultInitialState.i18n, action) {
  switch (action.type) {
    case actionTypes.CHANGE_LANGUAGE:
      return {
        ...state,
        ...{ language: toTwoLetterCode(action.language) },
      }

    default:
      return state
  }
}

export default i18n
