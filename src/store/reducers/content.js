import { actionTypes } from '../actions/content'
import defaultInitialState from '../defaultInitialState'

const splitSectionId = id => id.split('/')

const getSubSection = (currentSection, sectionId) => (
  currentSection.children.find(s => s.id === sectionId)
)
const getSection = (root, idTokens) => idTokens.reduce(getSubSection, root)
const getParentSection = (root, idTokens) => getSection(root, idTokens.slice(0, -1))

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
  getBreadcrumbSections: (state, id) => {
    const idTokens = splitSectionId(id)
    const result = idTokens.reduce((acc, sectionId) => {
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
  getPrevSectionId: (state, id) => {
    if (id === null || id === undefined) {
      return undefined
    }

    const root = { children: selectors.getToc(state) }
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
  getNextSectionId: (state, id, lvl) => { // Lvl should be undefined or 0 on initial call
    if (id === null || id === undefined) {
      return undefined
    }

    // Level indicates whether this is the initial call or a recursive one
    const level = lvl === undefined ? 0 : lvl

    const root = { children: selectors.getToc(state) }
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
        : selectors.getNextSectionId(state, parentSectionId, level + 1)
    }

    const nextSectionId = idTokens.slice(0, -1)
    nextSectionId
      .push(parentSection.children[currentSectionIndex + 1].id)
    return nextSectionId.join('/')
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
