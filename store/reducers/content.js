import {actionTypes} from '../actions/content'
import defaultInitialState from '../defaultInitialState'

function content(state = defaultInitialState.content, action) {
  switch (action.type) {
    case actionTypes.FAILURE:
      return {
        ...state,
        ...{error: action.error}
      }

    case actionTypes.LOAD_PAGE_SUCCESS:
      return {
        ...state,
        ...{page: action.data}
      }

    default:
      return state
  }
}

export default content
