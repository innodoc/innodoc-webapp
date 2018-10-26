import i18nSelectors from './i18n'

// helpers

const splitPath = path => path.split('/')

// Cosntructs an array of sections from a virtual root section (idx=-1) up to
// the section specifified as path. A single section looks like:
// {
//    idx: 3,
//    data: { id: 'section-1.1', children: ..., title: ... },
//    path: 'section1/secion-1.1',
// }
const getSections = (toc, path) => {
  const pathFragments = splitPath(path)
  const sections = [{
    idx: -1, // toc doesn't have a child index
    path: '',
    data: {
      children: toc,
    },
  }]
  for (let i = 0; i < pathFragments.length; i += 1) {
    const { children } = sections[sections.length - 1].data
    const idx = children.findIndex(s => s.id === pathFragments[i])
    if (idx === -1) {
      return undefined
    }

    const current = children[idx]
    const prefix = sections
      .slice(1) // Ignore root
      .map(s => s.data.id) // Get IDs
      .join('/') // Create prefix path

    sections.push({
      idx,
      path: i === 0
        ? current.id
        : `${prefix}/${current.id}`,
      data: current,
    })
  }

  return sections
}

export const findLastSubSectionPath = (toc, path) => {
  const sections = getSections(toc, path).map(s => s.data)
  let current = sections[sections.length - 1]
  while (current.children !== undefined) {
    current = current.children[current.children.length - 1]
    sections.push({ id: current.id })
  }
  return sections.slice(1).map(s => s.id).join('/')
}

const hasSubSections = section => (
  section.children !== undefined && section.children.length > 0
)

const getCurrentAndParentSection = sections => (
  {
    current: sections.pop(),
    parent: sections.pop(),
  }
)

// Selectors

const getContent = state => state.content.data[i18nSelectors.getLanguage(state)]

const getContentRoot = state => state.content.contentRoot

const getCurrentSectionPath = state => state.content.currentSectionPath

const getSectionContent = (state, path) => getContent(state).sections[path]

const getToc = state => state.content.toc

const getSection = (state, path) => {
  const sections = getSections(getToc(state), path)
  return sections === undefined
    ? undefined
    : sections[sections.length - 1].data
}

const getSectionLevel = (state, path) => splitPath(path).length

const getSectionTitle = (state, path) => {
  if (!path) { return undefined }
  const section = getSection(state, path)
  if (!section) { return undefined }
  return section.title
}

const getBreadcrumbSections = (state) => {
  const sections = getSections(getToc(state), getCurrentSectionPath(state))
    .map(s => s.data)
    .slice(1)

  const result = []
  sections.forEach((s, idx) => {
    result.push({
      path: result.length > 0
        ? `${result[idx - 1].path}/${s.id}`
        : s.id,
      title: s.title,
    })
  })

  return result
}

const getPrevSectionPath = (state, path) => {
  if (!path) { return undefined }

  const toc = getToc(state)
  const { current, parent } = getCurrentAndParentSection(getSections(toc, path))

  // Return parent section if this is the first sub section
  if (current.idx === 0) {
    return parent.path === '' ? undefined : parent.path
  }

  // Otherwise find the last sub section of previous sibling
  const parentPath = parent.path === '' ? parent.path : `${parent.path}/`
  return findLastSubSectionPath(toc, `${parentPath}${parent.data.children[current.idx - 1].id}`)
}

const getNextSectionPath = (state, path, first = true) => {
  if (!path) { return undefined }

  const { current, parent } = getCurrentAndParentSection(getSections(getToc(state), path))

  // If this section has sub sections and we're not in a recursive call then
  // return first sub section
  if (first === true && hasSubSections(current.data)) {
    return `${current.path}/${current.data.children[0].id}`
  }

  // If this section is the last sub section of its parent then get the next sibling of the parent
  if (current.idx === parent.data.children.length - 1) {
    return parent.path === ''
      ? undefined
      : getNextSectionPath(state, `${parent.path}`, false)
  }

  // If none of the above is true, then return next sibling
  return parent.path === ''
    ? parent.data.children[current.idx + 1].id
    : `${parent.path}/${parent.data.children[current.idx + 1].id}`
}

const getNavSections = (state) => {
  const path = getCurrentSectionPath(state)
  const prev = getPrevSectionPath(state, path)
  const next = getNextSectionPath(state, path)
  const sections = {}
  if (prev) {
    sections.prev = {
      path: prev,
      title: getSectionTitle(state, prev),
    }
  }
  if (next) {
    sections.next = {
      path: next,
      title: getSectionTitle(state, next),
    }
  }
  return sections
}

export default {
  getContentRoot,
  getCurrentSectionPath,
  getSectionContent,
  getContent,
  getToc,
  getSection,
  getSectionLevel,
  getSectionTitle,
  getBreadcrumbSections,
  getPrevSectionPath,
  getNextSectionPath,
  getNavSections,
}
