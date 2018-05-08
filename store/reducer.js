import {actionTypes} from './actions'

export const defaultInitialState = {
  sidebarVisible: true,
  pageContent: [],
}

function reducer(state = defaultInitialState, action) {
  switch (action.type) {
    case actionTypes.FAILURE:
      return {
        ...state,
        ...{error: action.error}
      }

    case actionTypes.LOAD_PAGE_SUCCESS:
      return {
        ...state,
        ...{pageContent: action.data}
      }

    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        ...{sidebarVisible: !state.sidebarVisible}
      }

    default:
      return state
  }
}

export default reducer
