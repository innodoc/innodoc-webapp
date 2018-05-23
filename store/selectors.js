export const getToc = state => state.content.toc

export const getSectionById = (state, id) => {
  const idFragments = id.split('/')
  let section = { children: state.content.toc }
  for (let i = 0; i < idFragments.length; i += 1) {
    section = section.children.find(s => s.id === idFragments[i])
  }
  return section
}

export const getCurrentSectionId = state => state.content.currentSectionId

export const getCurrentSection =
  state => getSectionById(state, getCurrentSectionId(state))
