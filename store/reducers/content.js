import { actionTypes } from '../actions/content'
import defaultInitialState from '../defaultInitialState'

export const getContentLoading = state => state.content.loading
export const getCurrentSectionId = state => state.content.currentSectionId
export const getSectionContent = (state, id) => state.content.sections[id]
export const getToc = state => state.content.toc
export const getSectionMeta = (state, id) => {
  const idFragments = id.split('/')
  let section = { children: getToc(state) }
  for (let i = 0; i < idFragments.length; i += 1) {
    section = section.children.find(s => s.id === idFragments[i])
  }
  return section
}

function content(state = defaultInitialState.content, action) {
  switch (action.type) {
    case actionTypes.FAILURE:
      return {
        ...state,
        ...{ error: action.error },
      }

    case actionTypes.LOAD_TOC_SUCCESS:
      return {
        ...state,
        ...{ toc: action.data },
      }

    case actionTypes.LOAD_SECTION:
      return {
        ...state,
        ...{
          loading: true,
          currentSectionId: null,
        },
      }

    case actionTypes.LOAD_SECTION_SUCCESS:
      return {
        ...state,
        ...{
          loading: false,
          currentSectionId: action.data.id,
          sections: {
            ...state.sections,
            [action.data.id]: action.data.content,
          },
        },
      }

    case actionTypes.LOAD_SECTION_FAILURE:
      return {
        ...state,
        ...{
          loading: false,
          error: action.error,
        },
      }

    default:
      return state
  }
}

export default content
