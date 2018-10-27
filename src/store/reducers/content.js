import { actionTypes as contentActionTypes } from '../actions/content'
import { actionTypes as i18nActionTypes } from '../actions/i18n'
import defaultInitialState, { defaultContentData } from '../defaultInitialState'

function content(state = defaultInitialState.content, action) {
  switch (action.type) {
    case contentActionTypes.LOAD_MANIFEST_SUCCESS:
      return {
        ...state,
        availableLanguages: action.data.languages,
        title: action.data.title,
        toc: action.data.toc,
        // data: {
        //   ...state.data,
        //   [action.data.language]: {
        //     ...state.data[action.data.language],
        //     toc: action.data.content,
        //   },
        // },
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
        sections: {
          ...state.sections,
          [action.data.language]: {
            ...state.sections[action.data.language],
            [action.data.sectionPath]: action.data.content,
          },
          // [action.data.language]: {
          //   ...state.data[action.data.language],
          //   sections: {
          //     ...state.data[action.data.language].sections,
          //   },
          // },
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

    // initialize language data if necessary
    case i18nActionTypes.CHANGE_LANGUAGE:
      return {
        ...state,
        sections: {
          ...state.sections,
          [action.language]: state.sections[action.language]
            ? state.sections[action.language]
            : {},
        },
      }

    default:
      return state
  }
}

export default content
