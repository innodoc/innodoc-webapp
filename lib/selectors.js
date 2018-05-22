const getSectionById = (state, id) => {
  const idFragments = id.split('/')
  let section = { children: state.content.toc }
  for (let i = 0; i < idFragments.length; i += 1) {
    section = section.children.find(s => s.id === idFragments[i])
  }
  return section
}

export default getSectionById
