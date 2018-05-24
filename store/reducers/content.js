import { actionTypes } from '../actions/content'
import defaultInitialState from '../defaultInitialState'

const splitSectionId = id => id.split('/')

export const selectors = {
  getContentLoading: state => state.content.loading,
  getCurrentSectionId: state => state.content.currentSectionId,
  getSectionContent: (state, id) => state.content.sections[id],
  getToc: state => state.content.toc,
  getSectionMeta: (state, id) => {
    const idFragments = splitSectionId(id)
    let section = { children: selectors.getToc(state) }
    for (let i = 0; i < idFragments.length; i += 1) {
      section = section.children.find(s => s.id === idFragments[i])
    }
    return section
  },
  getSectionLevel: (state, id) => splitSectionId(id).length,
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
