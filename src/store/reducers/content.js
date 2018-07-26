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
  getCurrentBreadcrumbSections: (state) => {
    const tokens = splitSectionId(selectors.getCurrentSectionId(state))
    const result = tokens.reduce((acc, sectionId) => {
      const section = acc.root.find(s => s.id === sectionId)
      acc.sections.push(
        {
          id: acc.sections.length > 0
            ? `${acc.sections[acc.sections.length - 1].id}/${sectionId}`
            : sectionId,
          title: section.title,
        })
      return {
        root: section.children,
        sections: acc.sections,
      }
    }, {
      root: selectors.getToc(state),
      sections: [],
    })

    return result.sections
  },
}

function content(state = defaultInitialState.content, action) {
  switch (action.type) {
    case actionTypes.LOAD_TOC_SUCCESS:
      return {
        ...state,
        ...{ toc: action.data },
      }

    case actionTypes.LOAD_TOC_FAILURE:
      return {
        ...state,
        ...{ toc: [] },
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
