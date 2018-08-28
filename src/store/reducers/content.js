import { actionTypes as contentActionTypes } from '../actions/content'
import { actionTypes as i18nActionTypes } from '../actions/i18n'
import defaultInitialState, { defaultContentData } from '../defaultInitialState'

function content(state = defaultInitialState.content, action) {
  switch (action.type) {
    case contentActionTypes.LOAD_TOC_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          [action.data.language]: {
            ...state.data[action.data.language],
            toc: action.data.content,
          },
        },
      }

    case contentActionTypes.LOAD_TOC_FAILURE:
      return {
        ...state,
        data: {
          ...state.data,
          [action.data.language]: {
            ...state.data[action.data.language],
            toc: [],
          },
        },
      }

    case contentActionTypes.LOAD_SECTION:
      return {
        ...state,
        currentSectionId: null,
      }

    case contentActionTypes.LOAD_SECTION_SUCCESS:
      return {
        ...state,
        currentSectionId: action.data.id,
        data: {
          ...state.data,
          [action.data.language]: {
            ...state.data[action.data.language],
            sections: {
              ...state.data[action.data.language].sections,
              [action.data.id]: action.data.content,
            },
          },
        },
      }

    case contentActionTypes.LOAD_SECTION_FAILURE:
      return {
        ...state,
        error: action.error,
      }

    // initialize language data if necessary
    case i18nActionTypes.CHANGE_LANGUAGE:
      return {
        ...state,
        data: {
          ...state.data,
          [action.language]: state.data[action.language]
            ? state.data[action.language]
            : defaultContentData,
        },
      }

    default:
      return state
  }
}

export default content
