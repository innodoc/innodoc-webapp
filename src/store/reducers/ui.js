import { actionTypes } from '../actions/ui'
import defaultInitialState from '../defaultInitialState'

export const selectors = {
  getSidebarVisible: state => state.ui.sidebarVisible,
  getMessage: state => state.ui.message,
}

function ui(state = defaultInitialState.ui, action) {
  switch (action.type) {
    case actionTypes.CLEAR_MESSAGE:
      return {
        ...state,
        ...{ message: null },
      }

    case actionTypes.SHOW_MESSAGE:
      return {
        ...state,
        ...{ message: action.data },
      }

    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        ...{ sidebarVisible: !state.sidebarVisible },
      }

    default:
      return state
  }
}

export default ui
