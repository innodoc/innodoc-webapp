import { actionTypes as contentActionTypes } from '../actions/content'
import { actionTypes as i18nActionTypes } from '../actions/i18n'
import defaultInitialState, { defaultContentData } from '../defaultInitialState'

const splitSectionId = id => id.split('/')

const getSubSection = (currentSection, sectionId) => (
  currentSection.children.find(s => s.id === sectionId)
)
const getSection = (root, idTokens) => idTokens.reduce(getSubSection, root)
const getParentSection = (root, idTokens) => getSection(root, idTokens.slice(0, -1))

export const selectors = {
  getContentLoading: state => state.content.loading,
  getCurrentSectionId: state => state.content.currentSectionId,
  getSectionContent: (state, lang, id) => selectors.getLanguageContent(state, lang).sections[id],
  getLanguageContent: (state, language) => state.content.data[language],
  getToc: (state, language) => selectors.getLanguageContent(state, language).toc,
  getSectionMeta: (state, language, id) => {
    const idFragments = splitSectionId(id)
    let section = { children: selectors.getToc(state, language) }
    for (let i = 0; i < idFragments.length; i += 1) {
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
  getPrevSectionId: (state, language, id) => {
    if (id === null || id === undefined) {
      return undefined
    }

    const root = { children: selectors.getToc(state, language) }
    const idTokens = splitSectionId(id)
    const currentSection = getSection(root, idTokens)
    const parentSection = getParentSection(root, idTokens)
    const currentSectionIndex = parentSection
      .children
      .findIndex(s => s.id === currentSection.id)

    if (currentSectionIndex === 0) {
      const prevSectionId = idTokens.slice(0, -1).join('/')
      return prevSectionId === '' ? undefined : prevSectionId
    }

    const prevSectionIdTokens = idTokens.slice(0, -1)
    prevSectionIdTokens
      .push(parentSection.children[currentSectionIndex - 1].id)

    // Look for last section
    let current = getSection(root, prevSectionIdTokens)
    while (current.children !== undefined) {
      current = current.children[current.children.length - 1]
      prevSectionIdTokens.push(current.id)
    }

    return prevSectionIdTokens.join('/')
  },
  getNextSectionId: (state, language, id, lvl) => { // Lvl should be undefined or 0 on initial call
    if (id === null || id === undefined) {
      return undefined
    }

    // Level indicates whether this is the initial call or a recursive one
    const level = lvl === undefined ? 0 : lvl

    const root = { children: selectors.getToc(state, language) }
    const idTokens = splitSectionId(id)
    const currentSection = getSection(root, idTokens)
    const parentSection = getParentSection(root, idTokens)
    const currentSectionIndex = parentSection
      .children
      .findIndex(s => s.id === currentSection.id)

    if (
      level === 0 // This must be the first call
      && currentSection.children !== undefined
      && currentSection.children.length > 0) {
      idTokens.push(currentSection.children[0].id)
      return idTokens.join('/')
    }

    if (currentSectionIndex === parentSection.children.length - 1) {
      const parentSectionId = idTokens.slice(0, -1).join('/')
      return parentSectionId === ''
        ? undefined
        : selectors.getNextSectionId(state, language, parentSectionId, level + 1)
    }

    const nextSectionId = idTokens.slice(0, -1)
    nextSectionId
      .push(parentSection.children[currentSectionIndex + 1].id)
    return nextSectionId.join('/')
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
        loading: true,
        currentSectionId: null,
      }

    case contentActionTypes.LOAD_SECTION_SUCCESS:
      return {
        ...state,
        loading: false,
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
        loading: false,
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
