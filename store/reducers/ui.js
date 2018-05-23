import { actionTypes } from '../actions/ui'
import defaultInitialState from '../defaultInitialState'

export const selectors = {
  getSidebarVisible: state => state.ui.sidebarVisible,
}

function ui(state = defaultInitialState.ui, action) {
  switch (action.type) {
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
