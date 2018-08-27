import { actionTypes as contentActionTypes } from '../actions/content'
import { actionTypes as i18nActionTypes } from '../actions/i18n'
import defaultInitialState, { defaultContentData } from '../defaultInitialState'

const splitSectionId = id => id.split('/')

export const selectors = {
  getCurrentSectionId: state => state.content.currentSectionId,
  getSectionContent: (state, lang, id) => selectors.getLanguageContent(state, lang).sections[id],
  getLanguageContent: (state, language) => state.content.data[language],
  getToc: (state, language) => selectors.getLanguageContent(state, language).toc,
  getSection: (state, language, id) => {
    const idFragments = splitSectionId(id)
    let section = { children: selectors.getToc(state, language) }
    for (let i = 0; i < idFragments.length; i += 1) {
      if (!section) {
        return undefined // not loaded yet
      }
      section = section.children.find(s => s.id === idFragments[i])
    }
    return section
  },
  getSectionLevel: (state, id) => splitSectionId(id).length,
  getCurrentBreadcrumbSections: (state, language) => {
    const tokens = splitSectionId(selectors.getCurrentSectionId(state))
    const result = tokens.reduce((acc, sectionId) => {
      const section = acc.root.find(s => s.id === sectionId)
      acc.sections.push({
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
      root: selectors.getToc(state, language),
      sections: [],
    })

    return result.sections
  },
}

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
