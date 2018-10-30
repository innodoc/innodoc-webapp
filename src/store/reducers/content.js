import { actionTypes as contentActionTypes } from '../actions/content'
import defaultInitialState from '../defaultInitialState'

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

    case contentActionTypes.LOAD_SECTION:
      return {
        ...state,
        currentSectionPath: null,
      }

    case contentActionTypes.LOAD_SECTION_SUCCESS:
      return {
        ...state,
        currentSectionPath: action.data.sectionPath,
        data: {
          ...state.data,
          [action.data.language]: {
            ...state.data[action.data.language],
            sections: {
              ...state.data[action.data.language].sections,
              [action.data.sectionPath]: action.data.content,
            },
          },
        },
      }

    case contentActionTypes.LOAD_SECTION_FAILURE:
      return {
        ...state,
        error: action.error,
      }

    case contentActionTypes.SET_CONTENT_ROOT:
      return {
        ...state,
        contentRoot: action.contentRoot,
      }

      // This is probably not necessary anymore since we are using redux-orm now
      //
      // initialize language data if necessary
      // case i18nActionTypes.CHANGE_LANGUAGE:
      //   return {
      //     ...state,
      //     data: {
      //       ...state.data,
      //       [action.language]: state.data[action.language]
      //         ? state.data[action.language]
      //         : defaultContentData,
      //     },
      //   }

    default:
      return state
  }
}

export default content
