import {actionTypes} from '../actions/content'
import defaultInitialState from '../defaultInitialState'

function content(state = defaultInitialState.content, action) {
  switch (action.type) {
    case actionTypes.FAILURE:
      return {
        ...state,
        ...{error: action.error}
    }

    case actionTypes.LOAD_TOC_SUCCESS:
      return {
        ...state,
        ...{toc: action.data}
    }

    case actionTypes.LOAD_PAGE_SUCCESS:
      return {
        ...state,
        ...{page: action.data}
      }

    case actionTypes.LOAD_PAGE_FAILURE:
      return {
        ...state,
        ...{error: action.error}
      }

    default:
      return state
  }
}

export default content
