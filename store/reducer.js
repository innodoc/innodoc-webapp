import {actionTypes} from './actions'

export const defaultInitialState = {
  placeholderData: null
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
        ...{content: action.data}
      }

    default:
      return state
  }
}

export default reducer
